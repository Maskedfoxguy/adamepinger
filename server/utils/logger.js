const winston = require('winston');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => {
    // Mask sensitive information with comprehensive patterns
    const message = typeof info.message === 'string' 
      ? info.message
          // Passwords (various forms)
          .replace(/password[=:]\s*[^\s]+/gi, 'password=***')
          .replace(/\b(pwd|pass)[=:]\s*[^\s]+/gi, '$1=***')
          // Tokens and authentication
          .replace(/token[=:]\s*[^\s]+/gi, 'token=***')
          .replace(/authorization:\s*[^\s]+/gi, 'authorization: ***')
          .replace(/bearer\s+[^\s]+/gi, 'bearer ***')
          .replace(/\bauth[=:]\s*[^\s]+/gi, 'auth=***')
          // API keys and secrets
          .replace(/\b(api[_-]?key|secret)[=:]\s*[^\s]+/gi, '$1=***')
      : info.message;
    
    return `${info.timestamp} ${info.level}: ${message}`;
  })
);

// Define transports
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

module.exports = logger;
