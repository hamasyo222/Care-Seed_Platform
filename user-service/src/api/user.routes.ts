import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const userRoutes = async (server: FastifyInstance) => {
    const userController = new UserController();

    server.register(async (authenticatedServer) => {
        authenticatedServer.addHook('preHandler', authMiddleware);

        authenticatedServer.get('/profile', userController.getProfile);
        authenticatedServer.patch('/profile', userController.updateProfile);
        authenticatedServer.get('/company', userController.getCompany);
    });
};
