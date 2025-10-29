// Provides JWT authentication middleware with development fallbacks.
const { expressjwt } = require("express-jwt");

const DEVELOPMENT_SECRET = "development-jwt-secret";
let cachedSecret;

// Resolve the runtime JWT secret while making the production requirement explicit.
function resolveTokenSecret() {
  if (cachedSecret) {
    // Reuse the cached secret so we only log the fallback warning once per boot.
    return cachedSecret;
  }

  const tokenSecret = process.env.TOKEN_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  if (!tokenSecret && isProduction) {
    throw new Error(
      "TOKEN_SECRET environment variable is required when running in production."
    );
  }

  if (!tokenSecret) {
    console.warn(
      "[jwt.middleware] TOKEN_SECRET not set. Using a default development secret."
    );

    cachedSecret = DEVELOPMENT_SECRET;
    return cachedSecret;
  }

  cachedSecret = tokenSecret;
  return cachedSecret;
}

const isAuthenticated = expressjwt({
  secret: resolveTokenSecret(),
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

function getTokenFromHeaders(req) {
  if (req.headers.authorization) {
    const [scheme, token] = req.headers.authorization.split(" ");

    if (scheme === "Bearer" && token) {
      return token;
    }
  }

  return null;
}

module.exports = {
  isAuthenticated,
  resolveTokenSecret,
};
