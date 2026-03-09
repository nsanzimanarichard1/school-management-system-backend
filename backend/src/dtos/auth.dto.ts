import { User, Device } from '@prisma/client';

// INPUT DTOs
export interface RegisterInputDTO {
  email: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'PARENT';
  deviceId: string;
  phone?: string;
}

export interface LoginInputDTO {
  email: string;
  password: string;
  deviceId?: string; // Optional for admin
}

// OUTPUT DTOs
export class AuthResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
  };

  static create(user: User, device: Device, token: string): AuthResponseDTO {
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: device.verified
      }
    };
  }
}

export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;

  static fromUser(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}
