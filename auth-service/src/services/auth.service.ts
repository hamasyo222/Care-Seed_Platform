import { PrismaClient, Prisma, users } from '@prisma/client';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { IRegisterRequestBody, IAuthResponse, IAuthTokens } from '../interfaces/auth.interfaces';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class AuthService {
    private passwordService: PasswordService;
    private tokenService: TokenService;

    constructor() {
        this.passwordService = new PasswordService();
        this.tokenService = new TokenService();
    }

    public async register(data: IRegisterRequestBody): Promise<IAuthResponse> {
        const { email, password, userType, profile } = data;

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            throw new ApiError(409, 'User with this email already exists.');
        }

        const hashedPassword = await this.passwordService.hash(password);

        const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const user = await tx.users.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    user_type: userType,
                },
            });

            await tx.user_profiles.create({
                data: {
                    user_id: user.id,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone: profile.phone,
                },
            });

            return user;
        });

        const tokens = this.generateAndReturnTokens(newUser);

        return {
            user: this.sanitizeUser(newUser),
            tokens,
        };
    }

    public async login(email: string, password: string): Promise<IAuthResponse> {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user || !user.password_hash) {
            throw new ApiError(401, 'Invalid email or password.');
        }

        const isPasswordValid = await this.passwordService.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password.');
        }

        const updatedUser = await prisma.users.update({
            where: { id: user.id },
            data: { last_login_at: new Date() },
        });

        const tokens = this.generateAndReturnTokens(updatedUser);

        return {
            user: this.sanitizeUser(updatedUser),
            tokens,
        };
    }

    private sanitizeUser(user: users): Partial<users> {
        const { password_hash, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    private generateAndReturnTokens(user: users): IAuthTokens {
        const payload = { userId: user.id };
        const accessToken = this.tokenService.generateAccessToken(payload);
        const refreshToken = this.tokenService.generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }
}
