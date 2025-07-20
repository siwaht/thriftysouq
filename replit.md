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

### Hero Banner Management System (January 20, 2025)
- **Dynamic Content Management**: Complete hero banner editing system integrated into admin panel
- **Database Schema**: Added hero_banner table with all content fields (titles, descriptions, button text, etc.)
- **Admin Interface**: Built comprehensive admin interface with form editing and live preview mode
- **API Integration**: Created GET/PUT endpoints for retrieving and updating banner content
- **Real-time Updates**: Hero banner on main site dynamically loads content from database
- **Preview Functionality**: Admin can preview changes before saving with realistic styling
- **Default Content**: Seeded database with default luxury-themed hero banner content
- **Form Validation**: Complete form validation with error handling and success notifications
- **Navigation Integration**: Added Hero Banner tab to admin panel with proper routing

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

### Admin Analytics Dashboard & Marketing Tools (January 20, 2025)
- **Comprehensive Analytics Dashboard**: Real-time analytics with revenue tracking, order metrics, and inventory insights
- **Advanced Marketing Tools**: Complete discount code management system with creation, editing, and usage tracking
- **Performance Monitoring**: Built-in analytics for sales trends, top-selling products, and customer behavior insights
- **Inventory Management**: Low stock alerts and automated inventory tracking with visual progress indicators
- **Marketing Campaign Management**: Full-featured discount code system with percentage/fixed discounts, usage limits, and expiration dates
- **Admin Navigation Enhancement**: Added analytics and marketing tabs to admin panel with proper Purple theme integration
- **Data Visualization**: Charts and metrics for business intelligence and decision-making support

### Performance & SEO Optimizations (January 20, 2025)
- **Comprehensive SEO Implementation**: Meta tags, Open Graph, Twitter Cards, and structured data for luxury e-commerce
- **Advanced Performance Optimizations**: GPU acceleration, font loading optimization, and reduced motion support
- **Mobile Performance Enhancements**: Touch optimization, responsive typography, and mobile-first CSS utilities
- **Image Optimization System**: Lazy loading, WebP support, and responsive image sizing for different screens
- **Accessibility Improvements**: Focus states, screen reader support, and keyboard navigation optimization
- **PWA Features**: Service worker registration, caching strategies, and offline support preparation
- **Web Vitals Monitoring**: LCP, FID, and CLS tracking for performance insights and optimization
- **Advanced CSS Utilities**: Modern gradients, glass effects, skeleton loading states, and scroll optimizations

### Enhanced Hero Banner Design (January 20, 2025)
- **Premium Visual Design**: Upgraded hero banner with sophisticated background effects, radial gradients, and subtle dot pattern overlay
- **Advanced Typography**: Enhanced text hierarchy with ultra-large display fonts, gradient text effects, and improved spacing
- **Interactive Elements**: Premium badge with multiple pulsing indicators, enhanced action buttons with hover effects, and smooth animations
- **Trust Indicators**: Added statistics section showcasing key value propositions (70% savings, 24h delivery, 100% authentic, 10K+ clients)
- **Scroll Indicator**: Added animated scroll indicator with mouse-like visual cue for better user guidance
- **Background Enhancements**: Multiple layered floating elements with different gradient colors and animation timings
- **Modern Button Design**: Enhanced call-to-action button with gradient effects, shadow improvements, and glass-morphism hover states
- **Visual Hierarchy**: Improved content spacing, better contrast ratios, and refined color scheme integration

### UAE Currency Integration (January 20, 2025)
- **Complete Currency Conversion**: Updated all product prices from USD to AED using 1 USD = 3.67 AED exchange rate
- **Database Migration**: Converted all existing product prices (original and discounted) to UAE Dirham in PostgreSQL
- **Frontend Updates**: Updated all currency displays across components (product cards, checkout, admin panel, modals)
- **Shipping Adjustment**: Updated free shipping threshold from $1000 to AED 3,670 and shipping cost from $25 to AED 92
- **Localization**: All pricing now displays in AED format throughout the application for UAE market
- **Admin Panel**: Updated product management and analytics to show prices in AED currency

### Performance & Mobile Optimization (January 20, 2025)
- **CSS Optimization**: Reduced font imports from 3 families to 2, removed redundant CSS classes and animations
- **Component Simplification**: Streamlined hero banner, navigation, and product cards for faster rendering
- **Mobile-First Design**: Optimized grid layouts (2 columns on mobile, 4 on desktop), reduced padding and margins
- **Image Optimization**: Reduced image heights on mobile (h-40 vs h-48), improved lazy loading implementation
- **Navigation Streamlined**: Simplified header from h-20 to h-16, reduced blur effects and animations
- **Button Optimization**: Simplified button styles, removed complex gradients and animations for better performance
- **Responsive Grid**: Improved product grid from xl:grid-cols-4 to responsive 2/3/4 column layout
- **Touch Optimization**: Enhanced mobile tap targets with minimum 44px height for better usability

### Comprehensive Webhook Integration for Product Management (January 20, 2025)
- **Product Management Webhooks**: Complete set of webhook endpoints for external product management including add, update, and delete operations
- **Order Management Webhooks**: Full webhook API for order status management including single and bulk order status updates
- **Bulk Operations Support**: Advanced bulk operations for creating, updating, and deleting multiple products in single requests
- **Webhook Authentication**: Optional signature-based authentication using X-Webhook-Secret header for secure integrations
- **External System Integration**: Full API documentation and examples for integrating with inventory management systems, POS systems, shipping providers, and e-commerce platforms
- **Order Status Management**: Webhook endpoints for updating order statuses (pending, processing, shipped, delivered, cancelled) programmatically
- **Data Validation**: Comprehensive validation for all webhook operations using Zod schemas to ensure data integrity
- **Error Handling**: Detailed error responses with specific validation messages for robust external integrations
- **Bulk Import/Export**: CSV-based bulk import and export functionality for efficient product catalog management
- **Interactive Testing**: Built-in webhook tester in admin panel for testing both product and order management endpoints
- **API Documentation**: Complete webhook examples and integration guide for developers including order management workflows

The application is designed for rapid deployment and scaling, with a focus on minimal setup requirements, quick commerce functionality, advanced admin management, comprehensive analytics, marketing automation, external system integration via webhooks, and fast time-to-market for luxury e-commerce operations.