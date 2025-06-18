import pino from 'pino';
import { config } from '../config';

const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
  },
};

const logger = pino({
  level: config.server.env === 'development' ? 'debug' : 'info',
  transport: config.server.env === 'development' ? devTransport : undefined,
});

export default logger;
