import { FastifyInstance } from 'fastify';
import { userRoutes } from './user.routes';

export const apiRoutes = async (server: FastifyInstance) => {
    server.register(userRoutes, { prefix: '/users' });
};
