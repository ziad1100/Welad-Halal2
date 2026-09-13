import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // OWNER — hardcoded, no env var override (SALT_ROUNDS=10)
  const hash = await bcrypt.hash('weladhalal', 10);
  await prisma.user.upsert({
    where: { username: 'Ahmed Elseyad' },
    update: {
      passwordHash: hash,
      role: 'owner',
      permissionLevel: 100,
      isOwner: true,
      isActive: true,
      forcePasswordChange: false,
    },
    create: {
      fullName: 'Ahmed Elseyad',
      username: 'Ahmed Elseyad',
      passwordHash: hash,
      role: 'owner',
      permissionLevel: 100,
      isOwner: true,
      isActive: true,
      forcePasswordChange: false,
    },
  });

  // DEFAULT BRANCH
  await prisma.branch.upsert({
    where: { id: 'branch-main' },
    update: {},
    create: { id: 'branch-main', name: 'ولاد حلال - الفرع الرئيسي', isActive: true },
  });

  // SYSTEM SETTINGS
  const settings = [
    { key: 'store_name', value: 'ولاد حلال' },
    { key: 'store_phone', value: '' },
    { key: 'store_accepting_orders', value: 'true' },
    { key: 'cash_discrepancy_threshold', value: '20' },
    { key: 'loyalty_points_rate', value: '1' },
    { key: 'return_approval_threshold', value: '500' },
  ];
  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  // DEFAULT CATEGORIES (structural only — no products invented)
  const cats = [
    'ألبان وأجبان',
    'لحوم ودواجن',
    'خضروات وفاكهة',
    'مياه ومشروبات',
    'مخبوزات',
    'معلبات',
    'منظفات',
    'وجبات خفيفة',
    'بقوليات',
    'أخرى',
  ];
  for (const name of cats) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seed complete.');
  console.log('Owner: Ahmed Elseyad / weladhalal');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
