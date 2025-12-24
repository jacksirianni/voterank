# VoteRank

**A modern, open-source ranked-choice voting platform built with Next.js**

VoteRank enables organizations to run fair, transparent elections using Instant Runoff Voting (IRV) and other ranked-choice methods. Perfect for team decisions, club elections, community polls, and anywhere you need a more representative voting outcome.

![VoteRank Demo](https://via.placeholder.com/800x400?text=VoteRank+Demo)

## ✨ Features

### Core Voting
- **Instant Runoff Voting (IRV)** - Finds a true majority winner through rounds of elimination
- **Drag-and-drop ranking** - Intuitive ballot interface with touch support
- **Grid-style ranking** - Alternative click-to-rank interface
- **Partial ranking support** - Voters can rank as many or few options as they want
- **Multi-category contests** - Run multiple elections in a single contest

### Transparency & Trust
- **Round-by-round results** - See exactly how votes transferred in each elimination round
- **Vote transfer tracking** - Understand where eliminated candidates' votes went
- **Exhausted ballot reporting** - Clear data on ballots that ran out of rankings
- **Result integrity hashing** - Verify results haven't been tampered with

### Access Control
- **Public link voting** - Anyone with the link can vote
- **Voter ID requirement** - Require identification before voting
- **Restricted voter lists** - Pre-approve who can participate
- **Device fingerprinting** - Detect potential duplicate submissions

### Organizer Tools
- **Contest dashboard** - Manage all your elections in one place
- **Real-time vote counts** - Watch participation as it happens
- **Ballot export** - Download raw ballot data (JSON/CSV)
- **Audit logging** - Track all significant actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/voterank.git
   cd voterank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/voterank"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed with demo data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating a Contest

1. Navigate to **Dashboard** → **New Contest**
2. Enter a title and optional description
3. Add at least 2 options for voters to rank
4. Configure settings:
   - **Voting Method**: Currently IRV (more methods coming)
   - **Ballot Style**: Drag-and-drop or number grid
   - **Voter ID**: Require identification or allow anonymous
   - **Partial Ranking**: Let voters rank only some options

### Sharing Your Contest

Once created, your contest will have a unique URL like:
```
https://your-domain.com/vote/your-contest-slug
```

Share this link with your voters. The contest must be set to **Open** status for voting.

### Viewing Results

Results are available at:
```
https://your-domain.com/vote/your-contest-slug/results
```

Results show:
- The winner and their final vote share
- Complete rankings of all candidates
- Round-by-round elimination breakdown
- Vote transfer details
- Exhausted ballot statistics

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS, Custom Design System |
| Database | PostgreSQL with Prisma ORM |
| Drag & Drop | @dnd-kit |
| Validation | Zod |

### Project Structure

```
voterank/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Demo data seeder
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   │   └── contests/
│   │   ├── create/      # Contest creation wizard
│   │   ├── dashboard/   # Organizer dashboard
│   │   ├── vote/        # Public voting pages
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Voting interface
│   │   │       └── results/      # Results display
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx     # Landing page
│   ├── components/
│   │   └── voting/
│   │       ├── DragBallot.tsx   # Drag-and-drop ballot
│   │       └── GridBallot.tsx   # Click-to-rank ballot
│   ├── lib/
│   │   ├── tabulation/
│   │   │   ├── types.ts    # Tabulation interfaces
│   │   │   ├── irv.ts      # IRV algorithm
│   │   │   └── index.ts    # Engine registry
│   │   ├── prisma.ts       # Database client
│   │   ├── validations.ts  # Zod schemas
│   │   └── utils.ts        # Helper functions
│   └── i18n/
│       └── index.ts        # Internationalization
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Database Schema

The database uses these main models:

- **Contest** - Elections with settings, timing, and status
- **Option** - Candidates/choices within contests
- **Category** - For multi-question contests
- **Ballot** - Individual vote submissions with rankings
- **Voter** - Voter registration and tracking
- **ResultSnapshot** - Cached tabulation results
- **AuditLog** - Action history for compliance

## 🔧 API Reference

### Contests

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contests` | GET | List all contests |
| `/api/contests` | POST | Create a contest |
| `/api/contests/[id]` | GET | Get contest details |
| `/api/contests/[id]` | PATCH | Update contest |
| `/api/contests/[id]` | DELETE | Delete contest |

### Options

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contests/[id]/options` | GET | List options |
| `/api/contests/[id]/options` | POST | Add option |
| `/api/contests/[id]/options` | PATCH | Reorder/update |
| `/api/contests/[id]/options` | DELETE | Remove option |

### Voting

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contests/[id]/vote` | POST | Submit ballot |
| `/api/contests/[id]/results` | GET | Get tabulated results |
| `/api/contests/[id]/export` | GET | Export ballot data |

## 🧮 How IRV Works

Instant Runoff Voting finds a winner through rounds of counting:

1. **Count first choices** - Each ballot's #1 pick gets counted
2. **Check for majority** - If someone has >50%, they win
3. **Eliminate lowest** - Remove the candidate with fewest votes
4. **Transfer votes** - Their ballots go to each voter's next choice
5. **Repeat** - Continue until someone reaches majority

This ensures the winner has broad support, not just a plurality.

## 🎨 Design System

VoteRank uses a warm, distinctive aesthetic:

- **Display Font**: Fraunces (serif)
- **Body Font**: DM Sans
- **Primary Color**: Warm orange (#f97316)
- **Accent Colors**: Amber to orange gradient

Custom CSS classes:
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` - Button variants
- `.card` - Elevated card containers
- `.input` - Form inputs
- `.badge-*` - Status badges

## 🛣️ Roadmap

### Coming Soon
- [ ] Authentication (magic link, OAuth)
- [ ] Email notifications
- [ ] Custom branding per contest
- [ ] Embed widget for external sites

### Future Methods
- [ ] Single Transferable Vote (STV) - Multi-winner
- [ ] Borda Count - Points-based ranking
- [ ] Condorcet - Pairwise comparison
- [ ] Approval Voting - Vote for many
- [ ] Score/STAR Voting - Rate each option

### Enterprise Features
- [ ] Workspace/team management
- [ ] SSO integration
- [ ] Audit compliance reports
- [ ] Premium support

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FairVote](https://www.fairvote.org/) for RCV education and advocacy
- [ElectionScience](https://electionscience.org/) for voting method research
- The open-source community for amazing tools

---

<p align="center">
  Built with ❤️ for better elections
</p>
