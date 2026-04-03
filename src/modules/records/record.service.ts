import prisma from '../../utils/prisma';
import { ApiError } from '../../utils/ApiError';
import { RecordType } from '../../../generated/prisma/client';

interface CreateRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  createdById: string;
}

interface FilterInput {
  type?: RecordType;
  category?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}

export const createRecord = async (input: CreateRecordInput) => {
  return prisma.financialRecord.create({
    data: {
      ...input,
      date: new Date(input.date),
    },
    include: { createdBy: { select: { id: true, name: true } } },
  });
};

export const getRecords = async (filters: FilterInput) => {
  const { type, category, from, to, page, limit } = filters;

  const where = {
    deletedAt: null, 
    ...(type && { type }),
    ...(category && {
      category: { contains: category }, 
    }),
    ...((from || to) && {
      date: {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      },
    }),
  };

  const [total, records] = await Promise.all([
    prisma.financialRecord.count({ where }),
    prisma.financialRecord.findMany({
      where,
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRecordById = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, deletedAt: null },
    include: { createdBy: { select: { id: true, name: true } } },
  });

  if (!record) throw ApiError.notFound('Record not found');
  return record;
};

export const updateRecord = async (id: string, data: Partial<CreateRecordInput>) => {

  await getRecordById(id);

  return prisma.financialRecord.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
    include: { createdBy: { select: { id: true, name: true } } },
  });
};

export const deleteRecord = async (id: string) => {

  await getRecordById(id);

  await prisma.financialRecord.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};