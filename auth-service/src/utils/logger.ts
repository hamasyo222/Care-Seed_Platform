import winston from 'winston';
import { config } from '../config';

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.server.env === 'development' ? 'debug' : 'info',
  format: config.server.env === 'development' ? devFormat : prodFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;
