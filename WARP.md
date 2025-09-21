# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Heritage 360 Buzz is a comprehensive hospitality management system built with a modern full-stack architecture. It manages hotels, restaurants, pubs, accounting, and inventory in a unified platform with multi-currency support (USD for hotels, GHS for restaurants/pubs).

## Architecture & Structure

### Full-Stack MERN Application
- **Frontend**: React 18 with TypeScript support, located in `/client`
- **Backend**: Node.js/Express.js API server, located in `/server` 
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with role-based access control (RBAC)

### Key Architectural Components

**Backend Structure**:
- `server/index.js` - Main Express server with middleware setup
- `server/models/` - Mongoose schemas (User, HotelBooking, Transaction, etc.)
- `server/routes/` - API route handlers (auth, hotel, restaurant, pub, accounting, inventory, reports)
- `server/middleware/` - Auth middleware and error handlers

**Frontend Structure**:
- `client/src/contexts/` - React contexts (AuthContext, ThemeContext)
- `client/src/components/Layout/` - Main layout components (Dashboard, Header, Sidebar)
- `client/src/pages/` - Route components and main pages
- `client/src/hooks/` - Custom React hooks
- `client/src/config/` - API configuration

**Business Logic Separation**:
- Hotel management (USD currency, room types: Double $40, Executive $60, Master $120)
- Restaurant POS system (GHS currency, local & continental menus)
- Pub services (GHS currency, beverage inventory)
- Multi-currency accounting system with audit trails
- Real-time inventory management with automated alerts

## Development Commands

### Prerequisites
Ensure Node.js (v18+), npm, and MongoDB are installed.

### Initial Setup
```bash
npm run install-all  # Install all dependencies (root + client)
```

### Development Commands
```bash
# Start full development environment (backend + frontend)
npm run dev

# Start only backend server with auto-reload
npm run server

# Start only React frontend
npm run client

# Build production frontend
npm run build

# Seed database with sample data
npm run seed
```

### Testing & Development
```bash
# Run tests (if available)
npm test

# Health check server endpoint
curl http://localhost:5000/api/health
```

### Production & Deployment
```bash
# Build for Vercel deployment
npm run vercel-build

# Production server start
npm start
```

## Environment Configuration

### Required Environment Variables
Create `.env` file in root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heritage360buzz
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
JWT_EXPIRE=30d

# Currency settings
HOTEL_CURRENCY=USD
RESTAURANT_CURRENCY=GHS
PUB_CURRENCY=GHS

# Business rates
DOUBLE_ROOM_RATE=40
EXECUTIVE_ROOM_RATE=60
MASTER_ROOM_RATE=120
VAT_RATE=0.125
SERVICE_CHARGE_RATE=0.10
```

For production deployment, see `.env.example` for Vercel-specific configuration.

## Database Architecture

### User Management System
- **Roles**: admin, manager, waiter, receptionist, accountant, store_keeper
- **Departments**: hotel, restaurant, pub, accounting, store, procurement, all
- **Permissions**: Granular module-based permissions with CRUD actions

### Multi-Currency Business Model
- **Hotel bookings** operate in USD with room types and rates
- **Restaurant/Pub** operations use GHS currency
- **Accounting system** handles both currencies with automatic conversion
- **Transaction tracking** with department source attribution

### Core Data Models
- `User` - Authentication & authorization with role-based permissions
- `HotelBooking` - Guest information, room details, payment status
- `RestaurantOrder` - POS orders with menu items and pricing
- `Transaction` - Multi-currency financial records with audit trails
- `Inventory` - Stock management with automated alerts

## Authentication & Security

### JWT Authentication Flow
1. Login via `POST /api/auth/login` with username/password
2. JWT token returned with user data and permissions
3. Protected routes require `Authorization: Bearer <token>` header
4. Token refresh and logout mechanisms implemented

### Security Features
- Rate limiting (100 requests per 15 minutes per IP)
- Helmet.js security headers
- CORS protection with configurable origins
- bcrypt password hashing
- Input validation and sanitization
- Role-based route protection

### Default Demo Users
- **admin/admin123** - Full system access
- **hotelmanager/hotel123** - Hotel department manager
- **restmanager/restaurant123** - Restaurant manager
- **waiter1/waiter123** - Restaurant/pub service staff
- **receptionist1/reception123** - Hotel front desk
- **accountant1/accounting123** - Financial management

## API Endpoints Structure

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - Create new user (admin only)
- `GET /api/auth/me` - Current user profile
- `PUT /api/auth/updatepassword` - Change password

### Business Modules
- `GET|POST /api/hotel/*` - Hotel booking and room management
- `GET|POST /api/restaurant/*` - Restaurant POS and orders
- `GET|POST /api/pub/*` - Pub inventory and sales
- `GET|POST /api/accounting/*` - Financial transactions and reporting
- `GET|POST /api/inventory/*` - Stock management and alerts
- `GET /api/reports/*` - Analytics and business intelligence

## Frontend Development

### Theme System
- 7 pre-built color themes (Heritage Gold default)
- Dark/light mode toggle functionality
- CSS custom properties for dynamic theming
- Persistent theme preferences

### Component Architecture
- Reusable layout components with responsive design
- Protected route wrappers with authentication checks
- Context-based state management (Auth, Theme)
- Mobile-first responsive design approach

### UI Framework
- **Tailwind CSS** for styling with custom theme extensions
- **Framer Motion** for smooth animations
- **Lucide React** for consistent iconography
- **React Hot Toast** for user notifications

## Development Guidelines

### Code Organization
- Follow established folder structure for consistency
- Separate business logic from UI components
- Use TypeScript where possible for type safety
- Implement proper error handling at all levels

### Database Operations
- All database models use Mongoose with validation schemas
- Implement proper indexing for performance
- Use transactions for multi-step operations
- Auto-seed functionality for development data

### API Development
- RESTful API design principles
- Consistent error response format
- Proper HTTP status codes
- Input validation middleware

## Deployment & Production

### Vercel Deployment Configuration
- `vercel.json` configured for full-stack deployment
- Frontend build serves from `/client/build`
- API routes handled via `/api/*` rewrites
- Environment variables set in Vercel dashboard

### GitHub Actions CI/CD
- Automated testing on push to main/master
- Production build verification
- Automatic deployment to Vercel
- Multi-Node.js version testing (18.x, 20.x)

### Production Considerations
- MongoDB Atlas for database hosting
- JWT secret management via environment variables
- CORS configuration for production domains
- Security headers and rate limiting enabled

## Performance & Monitoring

### Backend Optimization
- Express.js with production middleware
- MongoDB connection pooling
- Rate limiting for API protection
- Error logging and monitoring

### Frontend Optimization
- React production builds with code splitting
- Optimized asset loading
- Mobile-responsive design
- Progressive loading patterns

## Troubleshooting

### Common Development Issues
- **Database connection**: Verify MongoDB URI and network connectivity
- **Authentication errors**: Check JWT secret and token expiration
- **CORS issues**: Verify frontend URL in CORS configuration
- **Build failures**: Ensure all dependencies installed in both root and client

### Server Health Check
Access `GET /api/health` for server status and basic diagnostics.

### Log Locations
- Development: Console output with Morgan logging
- Production: Consider implementing structured logging service

This system provides a complete hospitality management solution with enterprise-grade architecture, security, and scalability features.