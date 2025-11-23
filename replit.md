# Overview

This is a full-stack web development service booking application built with React, TypeScript, Vite, Express.js, and PostgreSQL. The application allows clients to schedule appointments and request quotations for web development services through an elegant, minimalist interface. It features a public-facing landing page, an appointment booking system, a quotation calculator, and an admin panel for managing appointments.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build Tool**: React with TypeScript, bundled using Vite for fast development and optimized production builds. The application uses a client-side routing solution with Wouter for lightweight navigation.

**UI Component System**: Built on shadcn/ui components with Radix UI primitives, providing accessible and customizable UI elements. The design system uses Tailwind CSS with a custom configuration emphasizing a "new-york" style with neutral color theming and CSS variables for dynamic theming.

**State Management**: TanStack Query (React Query) handles server state, API calls, and caching. Form state is managed locally with React hooks, with validation handled through Zod schemas shared between frontend and backend.

**Styling Approach**: Tailwind CSS v4 (using @tailwindcss/vite plugin) with custom CSS variables for theming. The design emphasizes minimalist aesthetics with soft celeste lighting and modern workspace imagery.

**Deployment Strategy**: Frontend is deployed to Vercel as a static site with Vite's production build. The `vercel.json` configuration sets up SPA routing with fallback to `index.html` for all non-API routes.

## Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode. The application uses separate entry points for development (`index-dev.ts` with Vite middleware) and production (`index-prod.ts` serving static files).

**Database Layer**: Drizzle ORM with PostgreSQL (via Neon serverless driver). The database schema is defined in TypeScript with type-safe queries and migrations managed through Drizzle Kit.

**API Design**: RESTful API endpoints under `/api/*` prefix. The API handles:
- POST `/api/appointments` - Create new appointment bookings
- GET `/api/appointments` - Retrieve all appointments (admin)
- GET `/api/appointments/confirmed` - Get confirmed appointments only
- GET `/api/appointments/booked-slots` - Check availability for specific dates
- POST `/api/quotations` - Generate service quotations with dynamic pricing
- Additional CRUD operations for appointment and quotation management

**CORS Configuration**: Open CORS policy (`origin: '*'`) to support cross-origin requests from Vercel-deployed frontend to Replit-hosted backend. This architectural decision separates static asset hosting (Vercel) from API logic (Replit).

**Validation**: Zod schemas shared between frontend and backend ensure type safety and consistent validation. Phone number validation specifically handles Argentine phone number formats (+54 prefix patterns).

**Session Management**: Uses `express-session` with `connect-pg-simple` for PostgreSQL-backed session storage (based on package dependencies).

## Database Schema

**Appointments Table**: Stores client appointment requests with fields for name, phone (validated for Argentine formats), date, time, message, status (pending/confirmed), and soft deletion support via `deletedAt` timestamp.

**Quotations Table**: Tracks service quotation requests with pricing calculations based on service type (landing/corporate/ecommerce), number of pages, custom design requirements, integrations, urgency, and discounts. Stores final calculated price in Argentine pesos.

**Design Pattern**: UUID primary keys generated via PostgreSQL's `gen_random_uuid()`, timestamps for audit trails, and soft deletes for data retention.

## Architectural Decisions

### Monorepo Structure

**Decision**: Organize code into `client/`, `server/`, and `shared/` directories within a single repository.

**Rationale**: Enables code sharing (particularly Zod schemas) between frontend and backend while maintaining separation of concerns. The shared directory contains database schemas and TypeScript types used by both layers.

**Trade-off**: Increases build complexity but reduces duplication and ensures type consistency across the stack.

### Development vs Production Modes

**Decision**: Separate server entry points with Vite middleware in development and static file serving in production.

**Rationale**: Development mode uses Vite's HMR for instant feedback, while production serves pre-built static assets for optimal performance.

**Implementation**: The `index-dev.ts` integrates Vite's development server as Express middleware, while `index-prod.ts` serves from the `dist/public` directory.

### Frontend-Backend Separation

**Decision**: Deploy frontend to Vercel and backend to Replit, with frontend making cross-origin API requests.

**Rationale**: Leverages Vercel's global CDN for static assets while using Replit's always-on hosting for the backend API and database.

**Consideration**: Requires CORS configuration and handling of different deployment URLs. The codebase includes hardcoded Replit backend URLs in hooks (`useAppointmentForm.ts`) for direct API access.

### Type-Safe Database Layer

**Decision**: Use Drizzle ORM with TypeScript and code-first schema definitions.

**Rationale**: Provides compile-time type safety for database operations, automatic migration generation, and better developer experience compared to raw SQL or traditional ORMs.

**Alternative Considered**: Prisma was likely considered but Drizzle chosen for lighter weight and more SQL-like syntax.

### Phone Number Validation

**Decision**: Custom validation logic for Argentine phone numbers accepting multiple formats (with/without country code, with/without separators).

**Rationale**: Improves user experience by accepting various input formats commonly used in Argentina while ensuring data consistency.

**Implementation**: Validation strips non-numeric characters and checks length based on presence of country code (54).

# External Dependencies

## Database Services

- **Neon PostgreSQL**: Serverless PostgreSQL database accessed via `@neondatabase/serverless` driver. Connection configured through `DATABASE_URL` environment variable.

## Frontend Libraries

- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives (accordion, dialog, dropdown, select, etc.) forming the foundation of the component library.
- **TanStack Query**: Server state management library for data fetching, caching, and synchronization.
- **Wouter**: Minimalist routing library (~1.5KB) for client-side navigation.
- **date-fns**: Date utility library for formatting and manipulation.
- **React Hook Form** with Zod resolvers: Form state management with schema-based validation.

## UI & Styling

- **Tailwind CSS v4**: Utility-first CSS framework with Vite plugin integration.
- **shadcn/ui**: Component collection built on Radix UI with Tailwind styling.
- **class-variance-authority**: Utility for creating variant-based component styles.
- **Lucide React**: Icon library providing consistent iconography.

## Backend Libraries

- **Express.js**: Web framework for Node.js handling routing and middleware.
- **CORS**: Middleware enabling cross-origin resource sharing.
- **Drizzle ORM**: TypeScript ORM for type-safe database operations.
- **Zod**: Schema validation library shared between frontend and backend.

## Development Tools

- **Vite**: Build tool and dev server with fast HMR.
- **TypeScript**: Type-safe JavaScript with shared configurations across client and server.
- **esbuild**: JavaScript bundler used for production backend builds.
- **Replit-specific plugins**: Development banner, cartographer, and runtime error modal for enhanced Replit IDE integration.

## Deployment Platforms

- **Vercel**: Hosts the frontend static site with automatic deployments and global CDN.
- **Replit**: Hosts the backend Express server with persistent PostgreSQL database access.