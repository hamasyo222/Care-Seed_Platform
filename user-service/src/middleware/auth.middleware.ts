import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ message: 'Authentication required: No token provided.' });
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, config.jwt.accessTokenSecret) as { userId: string };
        request.user = { userId: decoded.userId };
    } catch (error: any) {
        request.log.warn('Authentication failed', { error: error.message });
        return reply.status(401).send({ message: 'Authentication failed: Invalid token.' });
    }
};
