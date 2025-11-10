# Quick Start Guide - Database Seeding

## TL;DR

```bash
# From backend directory
npm run seed:all

# Or individually
npm run seed:base      # Run first (creates modules, basic materials, basic assignments)
npm run seed:assessor  # Run second (adds more materials, assignments, submissions)
```

## What Gets Created

### Base Seed (`seed-database.js`)
- 3 Modules (Fundamental, Intermediate, Advance)
- 15 Learning Materials (5 per module)
- 15 Basic Assignments (5 per module)

### Assessor Seed (`seed-assessor-data.js`)
- 13 Additional Learning Materials (with rich content)
- 10 Additional Assignments (varied requirements)
- 15-20 Submissions (with scores, feedback, code)

## Total Data After Both Scripts

| Item | Count | Notes |
|------|-------|-------|
| Modules | 3 | fundamental, intermediate, advance |
| Learning Materials | 28+ | Mix of classes 1-10 |
| Assignments | 25+ | Active and inactive |
| Submissions | 15-20 | Graded and pending |

## Running Order

1. **First Time Setup**
   ```bash
   npm run seed:base
   npm run seed:assessor
   ```

2. **Add More Data Later**
   ```bash
   npm run seed:assessor  # Safe to run multiple times
   ```

3. **Complete Reset**
   ```sql
   -- In PostgreSQL
   TRUNCATE submissions, assignments, learning_materials, modules CASCADE;
   ```
   ```bash
   npm run seed:all
   ```

## Sample Data Details

### Learning Materials Include
- Title and description
- Rich content (theory + code examples)
- Video URLs (YouTube)
- Resource links (PDFs, PPTs, code repos)
- Duration (45-100 minutes)

### Assignments Include
- Detailed requirements (4-5 items each)
- Comprehensive rubrics (4 categories)
- Due dates (5-16 days from now)
- Mix of active/inactive

### Submissions Include
- Real JavaScript code samples
- Scores (70-99 for graded)
- Detailed feedback messages
- Rubric score breakdowns
- Realistic timestamps

## What the Assessor Dashboard Will Show

After seeding, you can:
- View 25+ assignments across all modules
- See 15-20 submissions in various states
- Review detailed rubric scores
- Filter by status (pending/graded/returned)
- Check submission dates and deadlines
- Read student code and feedback

## Common Issues

### "No modules found"
Run `seed:base` first

### "No active users found"
The script will skip submissions but continue

### "Duplicate entry" warnings
Normal - script is idempotent, skips existing data

### Database connection error
Check your `.env` file has correct credentials

## Files Created

```
/home/luthfi/codesmart/backend/scripts/
├── seed-database.js           # Base seeder (existing)
├── seed-assessor-data.js      # New assessor seeder
├── README-SEED-ASSESSOR.md    # Detailed documentation
└── QUICK-START.md             # This file
```

## Next Steps

After seeding:
1. Start the backend: `npm run dev`
2. Login as assessor
3. Navigate to assessor dashboard
4. See all the sample data in action!

## Need Help?

Read `README-SEED-ASSESSOR.md` for detailed documentation.
