import { PrismaClient, users, user_profiles, companies } from '@prisma/client';
import { IUpdateProfileData } from '../interfaces/user.interfaces';

const prisma = new PrismaClient();

export class UserService {
    public async getProfile(userId: string): Promise<object> {
        const userWithProfile = await prisma.users.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!userWithProfile) {
            throw new Error('User not found');
        }
        const { password_hash, ...sanitizedUser } = userWithProfile;
        return sanitizedUser;
    }

    public async updateProfile(userId: string, data: IUpdateProfileData): Promise<user_profiles> {
        const updatedProfile = await prisma.user_profiles.update({
            where: { user_id: userId },
            data: {
                ...data,
                birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
            },
        });
        return updatedProfile;
    }

    public async getCompanyByUserId(userId: string): Promise<companies | null> {
        const companyUser = await prisma.company_users.findFirst({
            where: { user_id: userId },
            include: { company: true },
        });
        return companyUser ? companyUser.company : null;
    }
}
