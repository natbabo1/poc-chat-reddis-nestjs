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

Generate the Prisma client and migrate the database:

```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run start:dev
```

Environment variables can be configured in a `.env` file. See `prisma/schema.prisma` for the `DATABASE_URL`.

