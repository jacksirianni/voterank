import { PrismaClient, ContestStatus, ContestVisibility, BallotStyle, VotingMethod, ContestType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo contest - City Mascot Vote
  const mascotContest = await prisma.contest.upsert({
    where: { slug: 'city-mascot-2024' },
    update: {},
    create: {
      slug: 'city-mascot-2024',
      title: 'City Mascot Selection 2024',
      description: 'Help us choose our new city mascot! Rank your favorite candidates in order of preference. Your vote matters in this ranked-choice election.',
      contestType: ContestType.ELECTION,
      votingMethod: VotingMethod.IRV,
      status: ContestStatus.OPEN,
      visibility: ContestVisibility.PUBLIC_LINK,
      ballotStyle: BallotStyle.DRAG,
      timezone: 'America/New_York',
      settings: {
        allowPartialRanking: true,
        showLiveResults: true,
        maxRanks: 5,
      },
    },
  });

  console.log('✅ Created contest:', mascotContest.title);

  // Create mascot options
  const mascotOptions = [
    { name: 'Ollie the Owl', description: 'Wise and watchful, Ollie represents our commitment to education and learning.' },
    { name: 'Rocky the Raccoon', description: 'Clever and resourceful, Rocky embodies the entrepreneurial spirit of our city.' },
    { name: 'Sunny the Sunflower', description: 'Bright and cheerful, Sunny symbolizes growth and community warmth.' },
    { name: 'Max the Mountain Lion', description: 'Strong and brave, Max represents our pioneering heritage.' },
    { name: 'Bubbles the Beaver', description: 'Hardworking and industrious, Bubbles celebrates our work ethic.' },
  ];

  for (let i = 0; i < mascotOptions.length; i++) {
    await prisma.option.upsert({
      where: {
        id: `mascot-option-${i}`,
      },
      update: {},
      create: {
        id: `mascot-option-${i}`,
        contestId: mascotContest.id,
        name: mascotOptions[i].name,
        description: mascotOptions[i].description,
        sortOrder: i,
      },
    });
  }

  console.log('✅ Created mascot options');

  // Create some sample ballots to demonstrate results
  const sampleBallots = [
    ['mascot-option-0', 'mascot-option-2', 'mascot-option-1'], // Ollie > Sunny > Rocky
    ['mascot-option-1', 'mascot-option-0', 'mascot-option-4'], // Rocky > Ollie > Bubbles
    ['mascot-option-2', 'mascot-option-0', 'mascot-option-1'], // Sunny > Ollie > Rocky
    ['mascot-option-0', 'mascot-option-1', 'mascot-option-2'], // Ollie > Rocky > Sunny
    ['mascot-option-3', 'mascot-option-0', 'mascot-option-2'], // Max > Ollie > Sunny
    ['mascot-option-4', 'mascot-option-1', 'mascot-option-0'], // Bubbles > Rocky > Ollie
    ['mascot-option-2', 'mascot-option-4', 'mascot-option-0'], // Sunny > Bubbles > Ollie
    ['mascot-option-0', 'mascot-option-2'], // Ollie > Sunny (partial)
    ['mascot-option-1', 'mascot-option-3', 'mascot-option-0'], // Rocky > Max > Ollie
    ['mascot-option-3', 'mascot-option-4', 'mascot-option-2'], // Max > Bubbles > Sunny
    ['mascot-option-0', 'mascot-option-1', 'mascot-option-3'], // Ollie > Rocky > Max
    ['mascot-option-2', 'mascot-option-0'], // Sunny > Ollie (partial)
    ['mascot-option-4', 'mascot-option-2', 'mascot-option-0'], // Bubbles > Sunny > Ollie
    ['mascot-option-1', 'mascot-option-0'], // Rocky > Ollie (partial)
    ['mascot-option-0', 'mascot-option-4', 'mascot-option-2'], // Ollie > Bubbles > Sunny
  ];

  for (let i = 0; i < sampleBallots.length; i++) {
    await prisma.ballot.create({
      data: {
        contestId: mascotContest.id,
        ranking: sampleBallots[i],
        deviceFingerprintHash: `demo-device-${i}`,
      },
    });
  }

  console.log('✅ Created sample ballots');

  // Create a multi-category contest - Annual Awards
  const awardsContest = await prisma.contest.upsert({
    where: { slug: 'annual-awards-2024' },
    update: {},
    create: {
      slug: 'annual-awards-2024',
      title: 'Annual Community Awards 2024',
      description: 'Vote for your favorite local businesses and community members across multiple categories.',
      contestType: ContestType.SURVEY,
      votingMethod: VotingMethod.IRV,
      status: ContestStatus.OPEN,
      visibility: ContestVisibility.PUBLIC_LINK,
      ballotStyle: BallotStyle.GRID,
      timezone: 'America/New_York',
      settings: {
        allowPartialRanking: true,
        showLiveResults: false,
      },
    },
  });

  console.log('✅ Created multi-category contest:', awardsContest.title);

  // Create categories
  const categories = [
    { title: 'Best Local Restaurant', description: 'Which restaurant serves the best food in town?' },
    { title: 'Best Coffee Shop', description: 'Where do you get your daily caffeine fix?' },
    { title: 'Community Champion', description: 'Who has made the biggest positive impact this year?' },
  ];

  for (let i = 0; i < categories.length; i++) {
    const category = await prisma.category.upsert({
      where: { id: `awards-category-${i}` },
      update: {},
      create: {
        id: `awards-category-${i}`,
        contestId: awardsContest.id,
        title: categories[i].title,
        description: categories[i].description,
        sortOrder: i,
      },
    });

    // Create options for each category
    const categoryOptions = i === 0
      ? ['The Golden Fork', 'Mama Rosa\'s Kitchen', 'Sakura Sushi', 'The Rustic Table']
      : i === 1
      ? ['Morning Brew', 'The Bean Counter', 'Café Luna', 'Grind House']
      : ['Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez', 'David Park'];

    for (let j = 0; j < categoryOptions.length; j++) {
      await prisma.option.create({
        data: {
          contestId: awardsContest.id,
          categoryId: category.id,
          name: categoryOptions[j],
          sortOrder: j,
        },
      });
    }
  }

  console.log('✅ Created categories and options');

  // Create a draft contest for testing
  await prisma.contest.upsert({
    where: { slug: 'team-lunch-poll' },
    update: {},
    create: {
      slug: 'team-lunch-poll',
      title: 'Team Lunch Location',
      description: 'Where should we go for the team lunch next Friday?',
      contestType: ContestType.POLL,
      votingMethod: VotingMethod.IRV,
      status: ContestStatus.DRAFT,
      visibility: ContestVisibility.PUBLIC_LINK,
      ballotStyle: BallotStyle.DRAG,
      timezone: 'America/Los_Angeles',
      settings: {
        allowPartialRanking: true,
        showLiveResults: true,
      },
    },
  });

  console.log('✅ Created draft contest');

  console.log('');
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('Demo contests available:');
  console.log('  • /vote/city-mascot-2024 - Mascot election with sample votes');
  console.log('  • /vote/annual-awards-2024 - Multi-category awards (grid ballot)');
  console.log('  • /vote/team-lunch-poll - Draft poll (not open for voting)');
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
