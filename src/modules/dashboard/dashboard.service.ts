import prisma from '../../utils/prisma';

export const getSummary = async () => {

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { type: 'INCOME', deletedAt: null },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.financialRecord.aggregate({
      where: { type: 'EXPENSE', deletedAt: null },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = incomeResult._sum.amount ?? 0;
  const totalExpenses = expenseResult._sum.amount ?? 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalRecords: incomeResult._count + expenseResult._count,
  };
};

export const getCategoryBreakdown = async () => {
  const records = await prisma.financialRecord.groupBy({
    by: ['category', 'type'],
    where: { deletedAt: null },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: 'desc' } },
  });

  return records.map((r) => ({
    category: r.category,
    type: r.type,
    total: r._sum.amount ?? 0,
    count: r._count,
  }));
};

export const getMonthlyTrends = async () => {

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const records = await prisma.financialRecord.findMany({
    where: {
      deletedAt: null,
      date: { gte: sixMonthsAgo },
    },
    select: { amount: true, type: true, date: true },
    orderBy: { date: 'asc' },
  });

  const monthMap = new Map<string, { income: number; expenses: number }>();

  for (const record of records) {
    const key = record.date.toISOString().slice(0, 7); 

    if (!monthMap.has(key)) {
      monthMap.set(key, { income: 0, expenses: 0 });
    }

    const entry = monthMap.get(key)!;
    if (record.type === 'INCOME') {
      entry.income += record.amount;
    } else {
      entry.expenses += record.amount;
    }
  }

  return Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    ...data,
    net: data.income - data.expenses,
  }));
};

export const getRecentActivity = async (limit = 5) => {
  return prisma.financialRecord.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { createdBy: { select: { id: true, name: true } } },
  });
};