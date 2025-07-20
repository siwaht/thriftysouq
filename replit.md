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

### Modern Slate-Emerald Design System (January 20, 2025)
- **Contemporary Color Palette**: Sophisticated slate-900/800 dark tones paired with vibrant emerald-500/600 accents
- **Typography Upgrade**: Added Google Fonts - Inter for body text and Playfair Display serif for headings
- **Hero Banner Redesign**: Full-height modern gradient background with animated blur orbs and improved typography hierarchy
- **Navigation Modernization**: Glass-dark effect header with emerald accent colors replacing purple theme
- **Product Cards Enhancement**: Clean white cards with subtle shadows, emerald gradient badges, and improved hover animations
- **Footer Redesign**: Sleek slate-900 background with emerald accents and better content organization
- **Animation System**: Custom CSS animations including fade-in, slide-up, scale-in, and staggered product card loading
- **Loading States**: Modern skeleton screens with proper card structure and smooth animations
- **Mobile Optimization**: Enhanced mobile-tap utilities and improved responsive design across all components
- **Performance Improvements**: Better CSS structure with component-based classes and optimized animations

### Comprehensive Admin Panel Implementation (January 20, 2025)
- **Complete Admin Dashboard**: Built full-featured admin interface at `/admin` route with luxury-themed design
- **Product Management System**: CRUD operations for all product fields including name, brand, category, pricing, stock, and images
- **Rich Form Interface**: Advanced form validation with Zod schemas, responsive design, and error handling
- **Navigation Component**: Fixed cart context errors to work properly across both main site and admin pages
- **Database Backend**: Complete API routes for products and menu items with PostgreSQL integration
- **Menu Items Management**: Added database schema and API endpoints for dynamic navigation menu control
- **Data Seeding**: Automated seeding for both products and menu items with proper error handling
- **Context Handling**: Updated useCart hook to gracefully handle usage outside CartProvider for admin pages
- **Mobile Optimization**: Fully responsive admin interface with mobile-first design principles
- **Purple Theme Integration**: Admin panel follows the same luxury purple-gold aesthetic as main site

### Admin Authentication System (January 20, 2025)
- **Complete Authentication Flow**: Implemented secure username/password authentication for admin panel access
- **Session Management**: Express-session with secure cookies for maintaining admin login state
- **Password Security**: Bcrypt hashing for secure password storage in PostgreSQL database
- **Admin User Seeding**: Automated admin user creation with default credentials (admin/admin123)
- **Authentication Middleware**: Protected all admin API routes with session-based authentication
- **Login/Logout System**: Beautiful admin login page with proper error handling and logout functionality
- **Route Protection**: Admin panel automatically redirects to login if not authenticated
- **Database Schema**: Added admin_users table with username and password hash fields
- **Default Admin Setup**: Created default admin user during application setup

### Performance & Mobile Optimization (January 20, 2025)
- **Mobile Responsiveness**: Complete mobile-first responsive design with adaptive sizing across all components
- **Touch Optimization**: Mobile-optimized touch targets, tap highlight removal, and gesture-friendly interactions
- **Performance CSS**: GPU acceleration, will-change properties, and reduced motion support for better performance
- **Image Optimization**: Lazy loading for product images and optimized image sizes for different screen sizes
- **Animation Scaling**: Reduced animation scales on mobile devices for better performance and battery life
- **Header Improvements**: Mobile-friendly category filters with horizontal scrolling and better touch targets
- **Cart Experience**: Full-width mobile cart with optimized spacing and improved usability
- **Checkout Flow**: Mobile-optimized checkout modal with better form layouts and responsive input fields
- **Typography Scaling**: Responsive text sizing from mobile to desktop with proper line heights
- **Background Optimization**: Scroll-based background attachment on mobile for better performance
- **Scrollbar Hiding**: Clean scrollbar hiding utilities for better mobile aesthetics

### Enhanced Quick Commerce Features (January 20, 2025)
- **Express Checkout System**: One-click checkout modal with minimal form fields for instant purchasing
- **Smart Filters**: Advanced filtering with price range, brand selection, discount thresholds, and quick filters
- **Quick Actions**: Wishlist, share, and instant add-to-cart actions on product cards
- **Minimalist UI**: Clean, focused interface prioritizing speed and ease of use
- **Mobile-First Design**: Optimized touch interactions and responsive layouts for mobile shopping

The application is designed for rapid deployment and scaling, with a focus on minimal setup requirements, quick commerce functionality, and fast time-to-market for luxury e-commerce operations.