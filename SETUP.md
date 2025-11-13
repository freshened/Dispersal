# Local Database Setup Guide

## Option 1: Using Docker (Recommended - Easiest)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Windows

### Steps:
1. Start Docker Desktop
2. Run the database:
   ```bash
   docker-compose up -d
   ```
3. Add to your `.env.local`:
   ```
   DATABASE_URL="postgresql://dispersal_user:dispersal_password@localhost:5432/dispersal"
   ```
4. Push the schema:
   ```bash
   npm run db:push
   ```
5. Done! Your database is running.

### To stop the database:
```bash
docker-compose down
```

### To view data:
```bash
npm run db:studio
```

---

## Option 2: Install PostgreSQL Directly

### Steps:
1. Download PostgreSQL from [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Install with default settings (remember the postgres user password)
3. Open pgAdmin or use psql command line
4. Create database:
   ```sql
   CREATE DATABASE dispersal;
   CREATE USER dispersal_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE dispersal TO dispersal_user;
   ```
5. Add to your `.env.local`:
   ```
   DATABASE_URL="postgresql://dispersal_user:your_password@localhost:5432/dispersal"
   ```
6. Push the schema:
   ```bash
   npm run db:push
   ```

---

## Environment Variables

Your `.env.local` file should contain:

```env
# Database
DATABASE_URL="postgresql://dispersal_user:dispersal_password@localhost:5432/dispersal"

# SMTP (for email)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@yourdomain.com
CONTACT_EMAIL=drew@dispersal.net
```

---

## Testing the Setup

1. Start your dev server:
   ```bash
   npm run dev
   ```
2. Visit http://localhost:3000/client-portal
3. Enter an email and request a code
4. Check your email for the code
5. Enter the code to sign in

---

## Useful Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:migrate` - Create migration files

