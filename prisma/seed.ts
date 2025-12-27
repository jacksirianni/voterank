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

  // Create the homepage demo contest - Best Beatles Song
  const demoContest = await prisma.contest.upsert({
    where: { slug: 'demo-election' },
    update: {
      status: ContestStatus.OPEN,
      title: 'Best Beatles Song',
      description: 'Experience ranked choice voting! Rank your favorite Beatles songs in order of preference. This interactive demo shows how instant runoff voting works.',
      ballotStyle: BallotStyle.GRID,
    }, // Always keep demo OPEN and updated
    create: {
      slug: 'demo-election',
      title: 'Best Beatles Song',
      description: 'Experience ranked choice voting! Rank your favorite Beatles songs in order of preference. This interactive demo shows how instant runoff voting works.',
      contestType: ContestType.POLL,
      votingMethod: VotingMethod.IRV,
      status: ContestStatus.OPEN,
      visibility: ContestVisibility.PUBLIC_LINK,
      ballotStyle: BallotStyle.GRID,
      timezone: 'UTC',
      settings: {
        allowPartialRanking: true,
        showLiveResults: true,
        maxRanks: 5,
      },
    },
  });

  console.log('✅ Created demo contest:', demoContest.title);

  // Create Beatles song options
  const beatlesSongs = [
    { name: 'Hey Jude', description: 'A timeless singalong anthem with an unforgettable coda that brings audiences together. (Hey Jude • 1968)' },
    { name: 'Let It Be', description: 'A soulful, gospel-inspired ballad offering comfort and hope through its simple, powerful message. (Let It Be • 1970)' },
    { name: 'Come Together', description: 'A funky, hypnotic groove with cryptic lyrics and one of the most iconic basslines in rock history. (Abbey Road • 1969)' },
    { name: 'Here Comes the Sun', description: 'A warm, uplifting ode to brighter days, featuring George Harrison\'s gentle guitar and optimistic melody. (Abbey Road • 1969)' },
    { name: 'A Day in the Life', description: 'An experimental masterpiece blending orchestral crescendos with poignant storytelling and dreamlike sequences. (Sgt. Pepper\'s Lonely Hearts Club Band • 1967)' },
    { name: 'Yesterday', description: 'A tender, melancholic ballad showcasing Paul McCartney\'s songwriting at its most introspective and timeless. (Help! • 1965)' },
    { name: 'Strawberry Fields Forever', description: 'A psychedelic journey into nostalgia and introspection, layered with lush production and haunting vocals. (Magical Mystery Tour • 1967)' },
    { name: 'While My Guitar Gently Weeps', description: 'A soulful meditation on love and loss, elevated by Eric Clapton\'s unforgettable guitar solo. (The Beatles (White Album) • 1968)' },
    { name: 'In My Life', description: 'A poignant reflection on memory and love, balancing wistfulness with gratitude in a beautifully crafted melody. (Rubber Soul • 1965)' },
    { name: 'Something', description: 'A sublime love song with one of the most beautiful melodies ever written, proving George Harrison\'s songwriting genius. (Abbey Road • 1969)' },
  ];

  const demoOptionIds: string[] = [];
  for (let i = 0; i < beatlesSongs.length; i++) {
    const option = await prisma.option.upsert({
      where: {
        id: `demo-option-${i}`,
      },
      update: {
        name: beatlesSongs[i].name,
        description: beatlesSongs[i].description,
      },
      create: {
        id: `demo-option-${i}`,
        contestId: demoContest.id,
        name: beatlesSongs[i].name,
        description: beatlesSongs[i].description,
        sortOrder: i,
      },
    });
    demoOptionIds.push(option.id);
  }

  console.log('✅ Created demo ice cream options');

  // Create realistic sample ballots with varied preferences
  const demoBallots = [
    // Chocolate fans (35%)
    [demoOptionIds[0], demoOptionIds[4], demoOptionIds[1]], // Chocolate > Cookie Dough > Vanilla
    [demoOptionIds[0], demoOptionIds[3], demoOptionIds[4]], // Chocolate > Mint > Cookie Dough
    [demoOptionIds[0], demoOptionIds[1], demoOptionIds[2]], // Chocolate > Vanilla > Strawberry
    [demoOptionIds[0], demoOptionIds[4], demoOptionIds[3]], // Chocolate > Cookie Dough > Mint
    [demoOptionIds[0], demoOptionIds[2]], // Chocolate > Strawberry
    [demoOptionIds[0], demoOptionIds[1]], // Chocolate > Vanilla
    [demoOptionIds[0], demoOptionIds[3], demoOptionIds[1]], // Chocolate > Mint > Vanilla
    [demoOptionIds[0], demoOptionIds[4]], // Chocolate > Cookie Dough
    [demoOptionIds[0], demoOptionIds[2], demoOptionIds[1]], // Chocolate > Strawberry > Vanilla
    [demoOptionIds[0], demoOptionIds[1], demoOptionIds[4]], // Chocolate > Vanilla > Cookie Dough
    [demoOptionIds[0], demoOptionIds[3]], // Chocolate > Mint
    [demoOptionIds[0], demoOptionIds[4], demoOptionIds[2]], // Chocolate > Cookie Dough > Strawberry
    [demoOptionIds[0]], // Chocolate only
    [demoOptionIds[0], demoOptionIds[2], demoOptionIds[3]], // Chocolate > Strawberry > Mint

    // Cookie Dough fans (30%)
    [demoOptionIds[4], demoOptionIds[0], demoOptionIds[1]], // Cookie Dough > Chocolate > Vanilla
    [demoOptionIds[4], demoOptionIds[1], demoOptionIds[0]], // Cookie Dough > Vanilla > Chocolate
    [demoOptionIds[4], demoOptionIds[3], demoOptionIds[0]], // Cookie Dough > Mint > Chocolate
    [demoOptionIds[4], demoOptionIds[0]], // Cookie Dough > Chocolate
    [demoOptionIds[4], demoOptionIds[1], demoOptionIds[3]], // Cookie Dough > Vanilla > Mint
    [demoOptionIds[4], demoOptionIds[2], demoOptionIds[0]], // Cookie Dough > Strawberry > Chocolate
    [demoOptionIds[4], demoOptionIds[0], demoOptionIds[3]], // Cookie Dough > Chocolate > Mint
    [demoOptionIds[4], demoOptionIds[1]], // Cookie Dough > Vanilla
    [demoOptionIds[4]], // Cookie Dough only
    [demoOptionIds[4], demoOptionIds[3], demoOptionIds[1]], // Cookie Dough > Mint > Vanilla
    [demoOptionIds[4], demoOptionIds[0], demoOptionIds[2]], // Cookie Dough > Chocolate > Strawberry
    [demoOptionIds[4], demoOptionIds[2]], // Cookie Dough > Strawberry

    // Mint Chip fans (18%)
    [demoOptionIds[3], demoOptionIds[0], demoOptionIds[4]], // Mint > Chocolate > Cookie Dough
    [demoOptionIds[3], demoOptionIds[1], demoOptionIds[0]], // Mint > Vanilla > Chocolate
    [demoOptionIds[3], demoOptionIds[4], demoOptionIds[0]], // Mint > Cookie Dough > Chocolate
    [demoOptionIds[3], demoOptionIds[0]], // Mint > Chocolate
    [demoOptionIds[3], demoOptionIds[2], demoOptionIds[1]], // Mint > Strawberry > Vanilla
    [demoOptionIds[3], demoOptionIds[1]], // Mint > Vanilla
    [demoOptionIds[3], demoOptionIds[4], demoOptionIds[1]], // Mint > Cookie Dough > Vanilla
    [demoOptionIds[3]], // Mint only
    [demoOptionIds[3], demoOptionIds[0], demoOptionIds[1]], // Mint > Chocolate > Vanilla

    // Vanilla fans (10%)
    [demoOptionIds[1], demoOptionIds[0], demoOptionIds[4]], // Vanilla > Chocolate > Cookie Dough
    [demoOptionIds[1], demoOptionIds[4], demoOptionIds[0]], // Vanilla > Cookie Dough > Chocolate
    [demoOptionIds[1], demoOptionIds[2]], // Vanilla > Strawberry
    [demoOptionIds[1], demoOptionIds[3], demoOptionIds[0]], // Vanilla > Mint > Chocolate
    [demoOptionIds[1]], // Vanilla only

    // Strawberry fans (7%)
    [demoOptionIds[2], demoOptionIds[1], demoOptionIds[0]], // Strawberry > Vanilla > Chocolate
    [demoOptionIds[2], demoOptionIds[4], demoOptionIds[1]], // Strawberry > Cookie Dough > Vanilla
    [demoOptionIds[2], demoOptionIds[3]], // Strawberry > Mint
    [demoOptionIds[2]], // Strawberry only
  ];

  for (let i = 0; i < demoBallots.length; i++) {
    await prisma.ballot.create({
      data: {
        contestId: demoContest.id,
        ranking: demoBallots[i],
        deviceFingerprintHash: `demo-ice-cream-${i}`,
      },
    });
  }

  console.log(`✅ Created ${demoBallots.length} demo ballots`);

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
  console.log('  • /vote/demo-election - Ice cream flavor poll (OPEN for interactive demo) 🍦');
  console.log('  • /vote/demo-election/results - View live demo results');
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
