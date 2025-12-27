import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing cached results for demo-election...');

  // Get the contest ID first
  const contest = await prisma.contest.findUnique({
    where: { slug: 'demo-election' }
  });

  if (!contest) {
    console.log('❌ Demo election contest not found');
    return;
  }

  console.log(`Found contest: ${contest.title} (${contest.id})`);

  const deleted = await prisma.resultSnapshot.deleteMany({
    where: {
      contestId: contest.id
    }
  });

  console.log(`✅ Deleted ${deleted.count} cached result snapshots`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
