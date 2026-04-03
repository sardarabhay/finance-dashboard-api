import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { Role } from '../../../generated/prisma/client';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: Role = 'VIEWER'
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw ApiError.badRequest('Email already in use');

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
    select: { id: true, name: true, email: true, role: true }, 
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};