import crypto from 'crypto';

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha512').update(password).digest('hex');
};

export const comparePassword = (password: string, hash: string): boolean => {
  const hashedPassword = hashPassword(password);
  return hashedPassword === hash;
};
