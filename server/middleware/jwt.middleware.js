
const { expressjwt } = require("express-jwt");
const AdminSession = require("../models/AdminSession.model");

const DEVELOPMENT_SECRET = "development-jwt-secret";
const SESSION_TIMEOUT = 60 * 60 * 1000;

let cachedSecret;

function resolveTokenSecret() {
  if (cachedSecret) {
    return cachedSecret;
  }

  const tokenSecret = process.env.TOKEN_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  if (!tokenSecret && isProduction) {
    throw new Error(
      "TOKEN_SECRET is required in production."
    );
  }

  if (!tokenSecret) {
    cachedSecret = DEVELOPMENT_SECRET;
    return cachedSecret;
  }

  cachedSecret = tokenSecret;
  return cachedSecret;
}

// Step 1: Verify the JWT signature and expiration.
const verifyJwt = expressjwt({
  secret: resolveTokenSecret(),
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

function getTokenFromHeaders(req) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme === "Bearer" && token) {
    return token;
  }

  return null;
}

// Step 2: Check the session against MongoDB.
async function checkAdminSession(req, res, next) {
  try {
    const { _id, sid, role } = req.payload || {};

    if (!_id || !sid || role !== "admin") {
      return res.status(401).json({
        message: "Invalid admin session.",
      });
    }

    const now = new Date();
    const inactivityLimit = new Date(
      now.getTime() - SESSION_TIMEOUT
    );

    // Only update sessions that are still valid.
    const session = await AdminSession.findOneAndUpdate(
      {
        sessionId: sid,
        adminId: _id,
        revoked: false,
        expiresAt: { $gt: now },
        lastActivity: { $gt: inactivityLimit },
      },
      {
        $set: { lastActivity: now },
      },
      {
        new: true,
      }
    );

    if (!session) {
      return res.status(401).json({
        message: "Your admin session has expired.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

// First verify JWT, then validate the database session.
function isAuthenticated(req, res, next) {
  verifyJwt(req, res, (error) => {
    if (error) {
      return next(error);
    }

    checkAdminSession(req, res, next);
  });
}

module.exports = {
  isAuthenticated,
  resolveTokenSecret,
};
