const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' })
  ]
});

const logRequest = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

module.exports = logRequest;
