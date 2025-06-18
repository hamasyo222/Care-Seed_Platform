import { users, user_profiles } from '@prisma/client';

export interface ITokenPayload {
    userId: string;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse {
    user: Partial<users>;
    tokens: IAuthTokens;
}

export interface IRegisterRequestBody {
    email: string;
    password: string;
    userType: users['user_type'];
    profile: Pick<user_profiles, 'first_name' | 'last_name' | 'phone'>;
}
