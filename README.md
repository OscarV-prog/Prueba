# prueba - SaaS Productivity Platform

This project is bootstrapped with `create-t3-app` and follows a strict **Clean Architecture** pattern.

## Project Structure

The project follows a **Controller → Service → Repository** pattern to ensure strict separation of concerns and maintainability.

### Key Directories

- `src/app/api/v1/`: **Controllers** (REST Route Handlers).
- `src/modules/`: **Domain Logic** (Services, Repositories, DTOs).
  - `{domain}/feature.service.ts`: Business logic & context.
  - `{domain}/feature.repository.ts`: Data access (Prisma).
  - `{domain}/feature.dto.ts`: Zod schemas & types.
- `src/lib/`: **Infrastructure** & Universal utilities.
- `src/components/ui/`: **UI Components** (shadcn/ui).
- `src/stores/`: **State Management** (Zustand).

### Architecture Rules

Strict layering rules are documented in [`src/.architecture-rules.md`](./src/.architecture-rules.md).

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma](https://prisma.io))
- **Auth**: [NextAuth.js](https://next-auth.js.org)
- **Validation**: [Zod](https://zod.dev)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Update database schema
npx prisma db push
```
