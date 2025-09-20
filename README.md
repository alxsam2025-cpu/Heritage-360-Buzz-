# Heritage 360 Buzz System

A comprehensive hotel, restaurant, and pub management system built with modern web technologies. This system provides a complete 360-degree infrastructure for managing all aspects of hospitality business operations.

## 🏨 System Overview

Heritage 360 Buzz is designed to manage:
- **Hotel Services**: Room bookings, reservations, guest management (USD currency)
- **Restaurant Services**: Food orders, menu management, table service (GHS currency)  
- **Pub Services**: Drink orders, inventory, bar management (GHS currency)
- **Accounting**: Financial tracking, expenses, revenue management
- **Store Management**: Inventory control, stock levels, procurement
- **User Management**: Role-based access control with different privilege levels

## ✨ Key Features

### 🏨 Hotel Management
- **24/7 Booking System** with real-time availability
- **Room Types**: Double ($40), Executive ($60), Master ($120)
- **Guest Management** with detailed customer information
- **Check-in/Check-out** processes
- **Room Status Tracking** (Available, Occupied, Cleaning, Maintenance)
- **Calendar Integration** for reservation management

### 🍽️ Restaurant Management
- **Modern POS System** with intuitive interface
- **Predefined Menus** for breakfast, lunch, and dinner
- **Local & Continental Dishes** with pricing in GHS
- **Order Management** (Dine-in, Takeaway, Room Service)
- **Kitchen Display System** integration
- **Table Management** and reservation system

### 🍺 Pub Services
- **Comprehensive Drink Menu** (Local & Continental)
- **Stock Management** with real-time inventory
- **Automated Reordering** alerts
- **Happy Hour** and promotional pricing
- **Bar Analytics** and reporting

### 💰 Accounting System
- **Complete Financial Tracking**
- **Multi-Currency Support** (USD for hotel, GHS for others)
- **Expense Management** 
- **Revenue Reporting**
- **Tax Calculations** (VAT, Service Charges)
- **Banking Integration**
- **Audit Trails** and internal controls

### 📦 Store Management
- **Inventory Control** with real-time tracking
- **Automated Alerts** for low stock
- **Expiry Date Management**
- **Supplier Management**
- **Purchase Order Generation**

### 👥 User Management
- **Role-Based Access Control**
- **User Types**: Admin, Manager, Waiter, Receptionist, Accountant, Store Keeper
- **Department-Based Permissions**
- **Activity Logging** and audit trails

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware

### Security Features
- **Rate Limiting** to prevent abuse
- **CORS** protection
- **JWT Authentication** 
- **Password Encryption**
- **Role-based Authorization**
- **Input Validation** and sanitization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Heritage360Buzz
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heritage360buzz
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
HOTEL_CURRENCY=USD
RESTAURANT_CURRENCY=GHS
PUB_CURRENCY=GHS
DOUBLE_ROOM_RATE=40
EXECUTIVE_ROOM_RATE=60
MASTER_ROOM_RATE=120
VAT_RATE=0.125
SERVICE_CHARGE_RATE=0.10
```

4. **Start the server**
```bash
npm start
# For development with auto-reload
npm run dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/logout` - Logout

### Hotel Management
- `GET /api/hotel/rooms` - Get all rooms
- `POST /api/hotel/rooms` - Create new room
- `PUT /api/hotel/rooms/:id` - Update room
- `DELETE /api/hotel/rooms/:id` - Delete room
- `GET /api/hotel/bookings` - Get all bookings
- `POST /api/hotel/bookings` - Create booking
- `PUT /api/hotel/bookings/:id/checkin` - Check-in guest
- `PUT /api/hotel/bookings/:id/checkout` - Check-out guest
- `GET /api/hotel/availability` - Check room availability

### Restaurant Management
- `GET /api/restaurant/menu` - Get menu items
- `POST /api/restaurant/menu` - Add menu item
- `GET /api/restaurant/orders` - Get orders
- `POST /api/restaurant/orders` - Create order
- `PUT /api/restaurant/orders/:id` - Update order status

### Pub Management
- `GET /api/pub/menu` - Get drink menu
- `POST /api/pub/menu` - Add drink item
- `GET /api/pub/orders` - Get drink orders
- `POST /api/pub/orders` - Create drink order

### Accounting
- `GET /api/accounting/transactions` - Get transactions
- `POST /api/accounting/transactions` - Record transaction
- `GET /api/accounting/reports` - Financial reports

### Inventory Management
- `GET /api/inventory/items` - Get inventory items
- `POST /api/inventory/items` - Add inventory item
- `PUT /api/inventory/items/:id` - Update inventory
- `GET /api/inventory/alerts` - Get stock alerts

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  username: String (unique),
  password: String (hashed),
  role: ['admin', 'manager', 'waiter', 'receptionist', 'accountant', 'store_keeper'],
  department: ['hotel', 'restaurant', 'pub', 'accounting', 'store', 'procurement', 'all'],
  permissions: [{ module, actions }],
  isActive: Boolean,
  lastLogin: Date
}
```

### Hotel Booking Model
```javascript
{
  bookingId: String (auto-generated),
  guestInfo: { firstName, lastName, email, phone, idType, idNumber },
  roomDetails: { roomType, roomNumber, rate, currency },
  bookingDates: { checkIn, checkOut, nights },
  status: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
  payment: { totalAmount, depositAmount, paymentStatus, transactions }
}
```

### Transaction Model
```javascript
{
  transactionId: String,
  type: ['income', 'expense', 'transfer'],
  category: String,
  amount: Number,
  currency: ['USD', 'GHS'],
  departmentSource: ['hotel', 'restaurant', 'pub', 'administration'],
  status: ['pending', 'completed', 'cancelled', 'reconciled']
}
```

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- All CRUD operations

### Manager
- Department oversight
- User creation (limited)
- Reports and analytics
- Approval workflows

### Waiter
- Order management
- Customer service
- Basic inventory checks
- Payment processing

### Receptionist
- Hotel bookings
- Guest check-in/out
- Room management
- Customer inquiries

### Accountant
- Financial transactions
- Reports generation
- Expense tracking
- Audit controls

### Store Keeper
- Inventory management
- Stock updates
- Purchase orders
- Supplier management

## 📊 Currency Management

The system supports dual-currency operations:
- **Hotel Services**: USD (Rooms: Double $40, Executive $60, Master $120)
- **Restaurant & Pub**: GHS (Ghana Cedis)
- **Automatic Currency Conversion** for reporting
- **Exchange Rate Management**

## 🚧 Development Roadmap

- [ ] Frontend React Application
- [ ] Real-time Notifications (Socket.io)
- [ ] Payment Gateway Integration
- [ ] SMS/Email Notifications
- [ ] Mobile App Development
- [ ] Advanced Analytics Dashboard
- [ ] Multi-location Support
- [ ] API Documentation (Swagger)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@heritage360buzz.com
- Phone: +233-XXX-XXXXX
- Documentation: [Link to detailed docs]

## 🙏 Acknowledgments

- Built with inspiration from modern hospitality management systems
- Based on the Whispers Buzz system concept
- Designed for scalability and reliability

---

**Heritage 360 Buzz System** - Comprehensive hospitality management for the modern age. 🏨🍽️🍺