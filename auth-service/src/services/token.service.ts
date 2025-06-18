import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { config } from '../config';
import { ITokenPayload } from '../interfaces/auth.interfaces';

export class TokenService {
    public generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, config.jwt.accessTokenSecret as string, {
            expiresIn: config.jwt.accessTokenExpiresIn as StringValue | number,
        });
    }

    public generateRefreshToken(payload: ITokenPayload): string {
        return jwt.sign(payload, config.jwt.refreshTokenSecret as string, {
            expiresIn: config.jwt.refreshTokenExpiresIn as StringValue | number,
        });
    }

    public verifyAccessToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, config.jwt.accessTokenSecret as string) as ITokenPayload;
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    public verifyRefreshToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, config.jwt.refreshTokenSecret as string) as ITokenPayload;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
