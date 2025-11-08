const { expressjwt } = require("express-jwt");

const DEVELOPMENT_SECRET = "development-jwt-secret";
let cachedSecret;

function resolveTokenSecret() {
  if (cachedSecret) {
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
