import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { RegisterInputDTO, LoginInputDTO } from '../dtos/auth.dto';
import notificationService from './notification.service';

export class AuthService {
  async register(data: RegisterInputDTO) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password with SHA-512
    const passwordHash = hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: data.role,
        phone: data.phone
      }
    });

    // Create device (unverified by default)
    const device = await prisma.device.create({
      data: {
        deviceId: data.deviceId,
        userId: user.id,
        verified: false
      }
    });

    // Create Student or Parent record
    if (data.role === 'STUDENT') {
      const student = await prisma.student.create({
        data: {
          userId: user.id
        }
      });

      // Create fee account for student
      await prisma.fee.create({
        data: {
          studentId: student.id,
          balance: 0
        }
      });
    } else if (data.role === 'PARENT') {
      await prisma.parent.create({
        data: {
          userId: user.id
        }
      });
    }

    // Generate token (even though device is not verified yet)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceId: device.deviceId
    });

    return { user, device, token };
  }

  async login(data: LoginInputDTO) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = comparePassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Admin login without device verification
    if (user.role === 'ADMIN') {
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        deviceId: 'admin-device'
      });

      // Create a verified device for admin if not exists
      let device = await prisma.device.findFirst({
        where: { userId: user.id }
      });

      if (!device) {
        device = await prisma.device.create({
          data: {
            userId: user.id,
            deviceId: 'admin-device',
            verified: true
          }
        });
      }

      return { user, device, token };
    }

    // Student/Parent/Teacher login requires device verification
    if (!data.deviceId) {
      throw new Error('Device ID is required');
    }

    const device = await prisma.device.findFirst({
      where: {
        userId: user.id,
        deviceId: data.deviceId
      }
    });

    if (!device) {
      throw new Error('Device not registered');
    }

    if (!device.verified) {
      throw new Error('Device not verified by admin');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceId: device.deviceId
    });

    // Send login success notification
    await notificationService.create(
      user.id,
      'LOGIN_SUCCESS',
      `Successful login from device ${data.deviceId} at ${new Date().toLocaleString()}`
    );

    return { user, device, token };
  }

  async getVerificationStatus(userId: string, deviceId: string) {
    const device = await prisma.device.findFirst({
      where: {
        userId,
        deviceId
      }
    });

    if (!device) {
      throw new Error('Device not found');
    }

    return {
      verified: device.verified,
      message: device.verified
        ? 'Device is verified'
        : 'Waiting for admin verification'
    };
  }
}

export default new AuthService();
