import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ITokenPayload } from '../interfaces/auth.interfaces';

export class TokenService {
    public generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, config.jwt.accessTokenSecret, {
            expiresIn: config.jwt.accessTokenExpiresIn,
        });
    }

    public generateRefreshToken(payload: ITokenPayload): string {
        return jwt.sign(payload, config.jwt.refreshTokenSecret, {
            expiresIn: config.jwt.refreshTokenExpiresIn,
        });
    }

    public verifyAccessToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, config.jwt.accessTokenSecret) as ITokenPayload;
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    public verifyRefreshToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, config.jwt.refreshTokenSecret) as ITokenPayload;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
