# ThriftySouq - Luxury E-commerce Platform

## Overview
ThriftySouq is a single-page e-commerce application designed for quick commerce, specializing in high-quality luxury brands offered at significant discounts. Built with React, Express, and TypeScript, it aims for fast loading times and a frictionless shopping experience. The project's vision is to capture the UAE market by providing a streamlined platform for discounted luxury goods, supported by advanced administrative, analytical, and marketing tools, and robust external integration capabilities.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: React Context API for cart, TanStack Query for server state
- **Routing**: Wouter
- **Build Tool**: Vite
- **UI/UX Decisions**: Modern slate-emerald design system with dark tones and vibrant emerald accents, Google Fonts (Inter, Playfair Display), full-height hero banner with gradients, clean product cards, glass-dark navigation, custom CSS animations, skeleton loading states, mobile-first responsive design.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API
- **Request Handling**: Express middleware for JSON, CORS, logging
- **Error Handling**: Centralized error handling
- **Core Features**: Product catalog with filtering, real-time shopping cart, one-step quick checkout, responsive design, admin panel with product/menu/hero banner management, admin authentication (token-based with Bcrypt), analytics dashboard, marketing tools (discount codes), webhook integration for product and order management.

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL
- **Schema**: Products, orders, order items, admin users, hero banners, menu items.
- **Storage**: DatabaseStorage for CRUD operations.
- **Seeding**: Automated seeding for initial data (products, admin users, menu items, hero banner).
- **Persistence**: Automatic database initialization and persistent session storage using PostgreSQL.

### Data Flow
Products are fetched via API. Client-side filtering uses custom events. Cart management uses context with local storage. Order processing involves form validation and API submission. Optimistic updates are used for cart operations.

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching.
- **@hookform/resolvers**: Form validation with Zod schemas.
- **@radix-ui/***: Headless UI components.
- **class-variance-authority**: Component variant management.
- **drizzle-orm**: Database ORM and query building.
- **@neondatabase/serverless**: PostgreSQL database driver.
- **drizzle-kit**: Database migration and schema management.
- **connect-pg-simple**: PostgreSQL session storage.
- **bcrypt**: Password hashing.

### Development Tools
- **Vite**: Build tool.
- **@replit/vite-plugin-runtime-error-modal**: Development error handling.
- **tsx**: TypeScript execution for development.
- **esbuild**: Server code bundling.

### Other Integrations
- **Google Fonts**: Inter, Playfair Display for typography.
- **MCP (Model Context Protocol) Server**: Integrated with stdio and HTTP for AI assistant and external system interaction (for managing products, orders, marketing, webhooks, analytics).