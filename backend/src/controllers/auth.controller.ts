import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthResponseDTO } from '../dtos/auth.dto';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/error.middleware';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user, device, token } = await authService.register(req.body);
    const response = AuthResponseDTO.create(user, device, token);
    res.status(201).json({ success: true, data: response });
  });

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user, device, token } = await authService.login(req.body);
    const response = AuthResponseDTO.create(user, device, token);
    res.json({ success: true, data: response });
  });

  getVerificationStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const status = await authService.getVerificationStatus(req.userId!, req.deviceId!);
    res.json({ success: true, data: status });
  });
}

export default new AuthController();
