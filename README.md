# Chat Application (NestJS)

This project is a skeleton for a chat application built with NestJS, PostgreSQL and Prisma.

## Features

- One to one chat
- Ready for group chats in the future
- Fetch the last message between users
- File sending support (stores file URL)
- Designed for up to 10k concurrent users

## Getting Started

Install dependencies (requires internet access):

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

If your Prisma schema changes and you need a migration, create one without
applying it to the database:

```bash
npx prisma migrate dev --create-only --name <migration-name>
```

You can then apply pending migrations when running locally:

```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run start:dev
```

Environment variables can be configured in a `.env` file. See `prisma/schema.prisma` for the `DATABASE_URL`.

