import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { IRegisterRequestBody } from '../interfaces/auth.interfaces';
import { ApiError } from '../middleware/errorHandler';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const registerData: IRegisterRequestBody = req.body;
            const result = await this.authService.register(registerData);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new ApiError(400, 'Email and password are required.'));
            }
            const result = await this.authService.login(email, password);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
