import prisma from '../../utils/prisma';
import { ApiError } from '../../utils/ApiError';
import { Role } from '../../../generated/prisma/client';

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) throw ApiError.notFound('User not found');
  return user;
};

export const updateUser = async (
  id: string,
  data: { name?: string; role?: Role; isActive?: boolean }
) => {

  await getUserById(id);

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  await getUserById(id);

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
};