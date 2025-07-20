# LuxDeal Quick - Luxury E-commerce Platform

## Overview

LuxDeal Quick is a single-page e-commerce application optimized for quick commerce, specializing in high-quality luxury brands offered at steep discounts. The application is built with a modern full-stack architecture using React, Express, and TypeScript, designed for fast loading times and a frictionless shopping experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for cart management, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints
- **Request Handling**: Express middleware for JSON parsing, CORS, and logging
- **Error Handling**: Centralized error handling middleware

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL with live database connection
- **Schema**: Products, orders, and order items tables with proper relationships and foreign keys
- **Storage**: DatabaseStorage implementation with full CRUD operations
- **Seeding**: Automated seeding with 30 luxury products from premium brands

## Key Components

### Data Models
- **Products**: ID, name, brand, category, pricing (original/discounted), discount percentage, image URL, stock
- **Orders**: Customer information, payment method, shipping address, order status
- **Order Items**: Product references with quantities and prices

### Core Features
1. **Product Catalog**: Display luxury items with discount highlights and category filtering
2. **Shopping Cart**: Real-time cart updates with quantity management
3. **Quick Checkout**: One-step checkout process without user registration
4. **Responsive Design**: Mobile-first approach with desktop optimization

### UI Components
- **Hero Banner**: Countdown timer and discount highlights
- **Product Grid**: Filterable product display with sorting options
- **Mini Cart**: Slide-out cart with item management
- **Checkout Modal**: Single-step purchase flow
- **Success Modal**: Order confirmation display

## Data Flow

1. **Product Loading**: API fetches products from storage layer on page load
2. **Category Filtering**: Client-side filtering with custom events for cross-component communication
3. **Cart Management**: Context-based state management with local storage persistence
4. **Order Processing**: Form validation, API submission, and success handling
5. **Real-time Updates**: Optimistic updates with error rollback for cart operations

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation with Zod schemas
- **@radix-ui/***: Headless UI components for accessibility
- **class-variance-authority**: Component variant management
- **drizzle-orm**: Database ORM and query building

### Development Tools
- **Vite**: Build tool with HMR and plugin ecosystem
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **tsx**: TypeScript execution for development server

### Database Integration
- **@neondatabase/serverless**: PostgreSQL database driver
- **drizzle-kit**: Database migration and schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle kit handles schema deployment

### Environment Configuration
- **Development**: Uses tsx for hot reloading and Vite dev server
- **Production**: Node.js serves bundled application with static file serving
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Performance Optimizations
- **Code Splitting**: Vite automatically splits vendor and app bundles
- **Asset Optimization**: Images and static assets are optimized during build
- **Caching**: TanStack Query provides intelligent data caching
- **CSS Optimization**: Tailwind purges unused styles in production

## Recent Changes

### Database Integration (January 20, 2025)
- **Migration**: Successfully migrated from in-memory storage to PostgreSQL database
- **Schema Deployment**: Created products, orders, and order_items tables with proper relationships
- **Data Seeding**: Populated database with 30 luxury products from premium brands
- **Storage Layer**: Implemented DatabaseStorage class with full CRUD operations
- **Testing**: Verified end-to-end functionality including product retrieval and order processing

The application is designed for rapid deployment and scaling, with a focus on minimal setup requirements and fast time-to-market for luxury e-commerce operations.