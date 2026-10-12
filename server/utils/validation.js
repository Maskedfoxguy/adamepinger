const urlPattern = /^https?:\/\/.+/i;
const emailPattern = /.+@.+\..+/i;
const imageDataUrlPattern =
  /^data:image\/(?:png|jpe?g|webp|gif|svg\+xml|avif);base64,[a-z0-9+/=\s]+$/i;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isStringArray = (value) =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

const isValidUrl = (value) => typeof value === "string" && urlPattern.test(value);

const isValidImageSource = (value) =>
  typeof value === "string" &&
  (urlPattern.test(value) || imageDataUrlPattern.test(value));

const isValidEmail = (value) => typeof value === "string" && emailPattern.test(value);

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseDate = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const candidate = new Date(value);
  return Number.isNaN(candidate.getTime()) ? null : candidate;
};

module.exports = {
  isNonEmptyString,
  isStringArray,
  isValidUrl,
  isValidImageSource,
  isValidEmail,
  isPlainObject,
  parseDate,
};