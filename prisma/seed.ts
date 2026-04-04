import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient, Role ,RecordType} from '../generated/prisma/client';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });
export default prisma;

const users = [
  { name: 'Admin User', email: 'admin@test.com', password: 'secret123', role: Role.ADMIN },
  { name: 'Analyst User', email: 'analyst@test.com', password: 'secret123', role: Role.ANALYST },
  { name: 'Viewer User', email: 'viewer@test.com', password: 'secret123', role: Role.VIEWER },
];

const records = [
  { amount: 50000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-01-01'), notes: 'January salary' },
  { amount: 12000, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-01-05'), notes: 'Office rent' },
  { amount: 3500, type: RecordType.EXPENSE, category: 'Food', date: new Date('2024-01-10') },
  { amount: 8000, type: RecordType.INCOME, category: 'Freelance', date: new Date('2024-01-15'), notes: 'Client project' },
  { amount: 2000, type: RecordType.EXPENSE, category: 'Utilities', date: new Date('2024-01-20') },

  { amount: 50000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-02-01'), notes: 'February salary' },
  { amount: 12000, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-02-05') },
  { amount: 4200, type: RecordType.EXPENSE, category: 'Food', date: new Date('2024-02-12') },
  { amount: 5000, type: RecordType.INCOME, category: 'Freelance', date: new Date('2024-02-18'), notes: 'Side project' },
  { amount: 1800, type: RecordType.EXPENSE, category: 'Utilities', date: new Date('2024-02-22') },

  { amount: 55000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-03-01'), notes: 'March salary with bonus' },
  { amount: 12000, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-03-05') },
  { amount: 3800, type: RecordType.EXPENSE, category: 'Food', date: new Date('2024-03-08') },
  { amount: 15000, type: RecordType.INCOME, category: 'Consulting', date: new Date('2024-03-14'), notes: 'Q1 consulting fee' },
  { amount: 6000, type: RecordType.EXPENSE, category: 'Travel', date: new Date('2024-03-20'), notes: 'Client visit' },

  { amount: 50000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-04-01') },
  { amount: 12000, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-04-05') },
  { amount: 4500, type: RecordType.EXPENSE, category: 'Food', date: new Date('2024-04-11') },
  { amount: 3000, type: RecordType.EXPENSE, category: 'Utilities', date: new Date('2024-04-18') },
  { amount: 7000, type: RecordType.INCOME, category: 'Freelance', date: new Date('2024-04-25') },

  { amount: 50000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-05-01') },
  { amount: 12000, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-05-05') },
  { amount: 5100, type: RecordType.EXPENSE, category: 'Food', date: new Date('2024-05-09') },
  { amount: 10000, type: RecordType.INCOME, category: 'Consulting', date: new Date('2024-05-16') },
  { amount: 2200, type: RecordType.EXPENSE, category: 'Utilities', date: new Date('2024-05-23') },

  { amount: 50000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-06-01') },
  { amount: 12000, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-06-05') },
  { amount: 4700, type: RecordType.EXPENSE, category: 'Food', date: new Date('2024-06-14') },
  { amount: 8500, type: RecordType.INCOME, category: 'Freelance', date: new Date('2024-06-19') },
  { amount: 3200, type: RecordType.EXPENSE, category: 'Travel', date: new Date('2024-06-27') },
];

async function main() {
  console.log('Seeding database...\n');

  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing data');

  const createdUsers = await Promise.all(
    users.map(async (u) => {
      const passwordHash = await bcrypt.hash(u.password, 10);
      return prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
        },
      });
    })
  );
  console.log(`Created ${createdUsers.length} users`);

  const admin = createdUsers.find((u) => u.role === Role.ADMIN)!;

  await Promise.all(
    records.map((r) =>
      prisma.financialRecord.create({
        data: { ...r, createdById: admin.id },
      })
    )
  );
  console.log(`Created ${records.length} financial records`);

  console.log('\nSeed complete\n');
  console.log('Test credentials:');
  console.log('─────────────────────────────────────');
  users.forEach((u) => {
    console.log(`${u.role.padEnd(10)} ${u.email} / ${u.password}`);
  });
  console.log('─────────────────────────────────────');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());