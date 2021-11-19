import winston from "winston";

const consoleTransport = new winston.transports.Console({
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.simple()
  ),
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.json(),
  transports: [
    consoleTransport,
    // logTransport,
  ],
});

export default logger;
