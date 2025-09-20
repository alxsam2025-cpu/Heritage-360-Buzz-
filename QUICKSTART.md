# Heritage 360 Buzz - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set up MongoDB
Make sure MongoDB is running on your system:
- **Local MongoDB**: Start your MongoDB service
- **MongoDB Atlas**: Use the connection string from your Atlas cluster

### Step 3: Configure Environment
The `.env` file is already configured with default values. Modify if needed:
```env
MONGODB_URI=mongodb://localhost:27017/heritage360buzz
```

### Step 4: Seed the Database
```bash
npm run seed
```

### Step 5: Start the Server
```bash
npm start
```

The API will be available at: `http://localhost:5000`

## 🔐 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| **Admin** | admin | admin123 |
| **Hotel Manager** | hotelmanager | hotel123 |
| **Restaurant Manager** | restmanager | restaurant123 |
| **Waiter** | waiter1 | waiter123 |
| **Receptionist** | receptionist1 | reception123 |
| **Accountant** | accountant1 | accounting123 |

## 🧪 Test the API

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Get Hotel Rooms (use the token from login response)
```bash
curl -X GET http://localhost:5000/api/hotel/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Check Dashboard Statistics
```bash
curl -X GET http://localhost:5000/api/reports/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 What's Included

### ✅ Sample Data Created:
- **9 Hotel Rooms** (Double: $40, Executive: $60, Master: $120)
- **14 Restaurant Menu Items** (Local & Continental dishes)
- **13 Pub Drinks** (Local & Continental beverages)
- **10 Inventory Items** (Food, cleaning supplies, amenities)
- **6 User Accounts** (Different roles and permissions)

### ✅ Ready-to-Use Features:
- **User Authentication** with JWT
- **Role-Based Access Control**
- **Hotel Booking System**
- **Restaurant Order Management**
- **Pub Inventory System**
- **Accounting & Transactions**
- **Store Management**
- **Reports & Analytics**

## 🌐 API Endpoints Overview

| Module | Base Path | Description |
|--------|-----------|-------------|
| Authentication | `/api/auth` | Login, logout, user management |
| Hotel | `/api/hotel` | Rooms, bookings, availability |
| Restaurant | `/api/restaurant` | Menu, orders, kitchen management |
| Pub | `/api/pub` | Drinks menu, orders, inventory |
| Accounting | `/api/accounting` | Transactions, financial tracking |
| Inventory | `/api/inventory` | Stock management, alerts |
| Reports | `/api/reports` | Analytics, dashboard data |
| Users | `/api/users` | User management (Admin only) |

## 💰 Currency Settings

- **Hotel Services**: USD (Rooms charged in dollars)
- **Restaurant & Pub**: GHS (Ghana Cedis)
- **Dual Currency Support** in accounting system

## 🎯 Next Steps

1. **Frontend Development**: Build React.js frontend
2. **Payment Integration**: Add payment gateways
3. **Real-time Features**: Implement Socket.io for live updates
4. **Mobile App**: Develop mobile application
5. **Advanced Analytics**: Create business intelligence dashboard

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB (Linux)
sudo systemctl start mongod

# Windows: Start MongoDB service from Services
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Reset Database
```bash
# Drop the database and re-seed
mongo heritage360buzz --eval "db.dropDatabase()"
npm run seed
```

## 📞 Support

For issues and questions:
- Check the main README.md for detailed documentation
- Review API endpoints in the respective route files
- Examine model schemas for data structure

---

**Ready to build the future of hospitality management!** 🏨🍽️🍺