import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { IUpdateProfileData } from '../interfaces/user.interfaces';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = request.user.userId;
            const userProfile = await this.userService.getProfile(userId);
            return reply.status(200).send({ success: true, data: userProfile });
        } catch (error) {
            throw error;
        }
    };

    public updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = request.user.userId;
            const updateData = request.body as IUpdateProfileData;
            const updatedProfile = await this.userService.updateProfile(userId, updateData);
            return reply.status(200).send({ success: true, data: updatedProfile });
        } catch (error) {
            throw error;
        }
    };

    public getCompany = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = request.user.userId;
            const company = await this.userService.getCompanyByUserId(userId);
            if (!company) {
                return reply.status(404).send({ message: 'Company not found for this user.' });
            }
            return reply.status(200).send({ success: true, data: company });
        } catch (error) {
            throw error;
        }
    };
}
