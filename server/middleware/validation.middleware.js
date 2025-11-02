const { body, validationResult } = require('express-validator');

// Validation middleware for common patterns
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Common validation rules
const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Must be a valid email address');

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

const stringValidation = (field, minLength = 1, maxLength = 500) =>
  body(field)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .escape()
    .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`);

module.exports = {
  validateRequest,
  emailValidation,
  passwordValidation,
  stringValidation,
};
