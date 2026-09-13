import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.findFirst({ where: { isOwner: true } });
  const userCount = await prisma.user.count();
  const branchCount = await prisma.branch.count();
  const settingCount = await prisma.systemSetting.count();
  console.log('=== SEED STATUS ===');
  console.log('owners:', owner ? 1 : 0);
  console.log('username:', owner?.username);
  console.log('role:', owner?.role);
  console.log('level:', owner?.permissionLevel);
  console.log('isOwner:', owner?.isOwner);
  console.log('isActive:', owner?.isActive);
  console.log('forcePwChange:', owner?.forcePasswordChange);
  console.log('totalUsers:', userCount);
  console.log('branches:', branchCount);
  console.log('settings:', settingCount);
}

main().finally(async () => prisma.$disconnect());
