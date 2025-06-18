import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { config } from './config';
import logger from './utils/logger';
import { apiRoutes } from './api';

const server: FastifyInstance = Fastify({ logger });

server.register(helmet);
server.register(cors, { origin: '*' });

server.get('/health', async () => ({ status: 'UP', service: 'User Service' }));

server.register(apiRoutes, { prefix: '/api/v1' });

server.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(error.statusCode || 500).send({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An internal server error occurred.',
    },
  });
});

const start = async () => {
  try {
    await server.listen({ port: config.server.port, host: config.server.host });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

export default server;
