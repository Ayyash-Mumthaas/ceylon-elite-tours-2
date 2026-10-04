import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.siteSetting.update({
    where: { key: 'brandName' },
    data: { value: 'Test Tourism Brand' }
  });
  console.log('Brand name updated!');
}
main().finally(() => prisma.$disconnect());
