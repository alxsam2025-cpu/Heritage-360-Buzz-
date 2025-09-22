// Demo data for Heritage 360 Buzz - In-memory fallback
export const demoUsers = [
  {
    _id: "demo_admin",
    name: "System Administrator",
    username: "admin",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // admin123
    role: "admin",
    department: "all",
    permissions: [
      { module: "hotel", actions: ["create", "read", "update", "delete", "approve"] },
      { module: "restaurant", actions: ["create", "read", "update", "delete", "approve"] },
      { module: "pub", actions: ["create", "read", "update", "delete", "approve"] },
      { module: "accounting", actions: ["create", "read", "update", "delete", "approve"] },
      { module: "store", actions: ["create", "read", "update", "delete", "approve"] },
      { module: "procurement", actions: ["create", "read", "update", "delete", "approve"] },
      { module: "reports", actions: ["create", "read", "update", "delete"] },
      { module: "users", actions: ["create", "read", "update", "delete"] }
    ],
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    lastLogin: new Date()
  },
  {
    _id: "demo_hotelmanager",
    name: "Hotel Manager",
    username: "hotelmanager",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // hotel123
    role: "manager",
    department: "hotel",
    permissions: [
      { module: "hotel", actions: ["create", "read", "update", "delete"] },
      { module: "reports", actions: ["read"] }
    ],
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    lastLogin: new Date()
  },
  {
    _id: "demo_restmanager",
    name: "Restaurant Manager",
    username: "restmanager",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // restaurant123
    role: "manager",
    department: "restaurant",
    permissions: [
      { module: "restaurant", actions: ["create", "read", "update", "delete"] },
      { module: "reports", actions: ["read"] }
    ],
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    lastLogin: new Date()
  },
  {
    _id: "demo_waiter1",
    name: "Waiter Staff",
    username: "waiter1",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // waiter123
    role: "waiter",
    department: "restaurant",
    permissions: [
      { module: "restaurant", actions: ["read", "update"] }
    ],
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    lastLogin: new Date()
  },
  {
    _id: "demo_receptionist1",
    name: "Front Desk Receptionist",
    username: "receptionist1",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // reception123
    role: "receptionist",
    department: "hotel",
    permissions: [
      { module: "hotel", actions: ["read", "update"] }
    ],
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    lastLogin: new Date()
  },
  {
    _id: "demo_accountant1",
    name: "Chief Accountant",
    username: "accountant1",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // accounting123
    role: "accountant",
    department: "accounting",
    permissions: [
      { module: "accounting", actions: ["create", "read", "update", "delete"] },
      { module: "reports", actions: ["create", "read"] }
    ],
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    lastLogin: new Date()
  }
];

// Demo hotel rooms
export const demoRooms = [
  { _id: "room_001", number: "101", type: "Double", rate: 40, currency: "USD", status: "Available", floor: 1 },
  { _id: "room_002", number: "102", type: "Double", rate: 40, currency: "USD", status: "Available", floor: 1 },
  { _id: "room_003", number: "201", type: "Executive", rate: 60, currency: "USD", status: "Available", floor: 2 },
  { _id: "room_004", number: "202", type: "Executive", rate: 60, currency: "USD", status: "Available", floor: 2 },
  { _id: "room_005", number: "301", type: "Master", rate: 120, currency: "USD", status: "Available", floor: 3 }
];

// Demo restaurant menu
export const demoRestaurantMenu = [
  { _id: "menu_001", name: "Jollof Rice", price: 25, currency: "GHS", category: "Local", available: true },
  { _id: "menu_002", name: "Fried Chicken", price: 30, currency: "GHS", category: "Continental", available: true },
  { _id: "menu_003", name: "Banku with Tilapia", price: 35, currency: "GHS", category: "Local", available: true },
  { _id: "menu_004", name: "Pizza Margherita", price: 45, currency: "GHS", category: "Continental", available: true }
];

// Demo pub menu
export const demoPubMenu = [
  { _id: "pub_001", name: "Club Beer", price: 8, currency: "GHS", category: "Local", stock: 50 },
  { _id: "pub_002", name: "Guinness", price: 12, currency: "GHS", category: "International", stock: 30 },
  { _id: "pub_003", name: "Akpeteshie", price: 15, currency: "GHS", category: "Local", stock: 25 },
  { _id: "pub_004", name: "Whiskey", price: 80, currency: "GHS", category: "International", stock: 10 }
];

// Demo transactions
export const demoTransactions = [
  { _id: "txn_001", type: "income", amount: 120, currency: "USD", department: "hotel", description: "Room booking", date: new Date() },
  { _id: "txn_002", type: "income", amount: 45, currency: "GHS", department: "restaurant", description: "Food order", date: new Date() },
  { _id: "txn_003", type: "income", amount: 24, currency: "GHS", department: "pub", description: "Drinks sale", date: new Date() }
];

// In-memory database simulation
export const demoDatabase = {
  users: demoUsers,
  rooms: demoRooms,
  restaurantMenu: demoRestaurantMenu,
  pubMenu: demoPubMenu,
  transactions: demoTransactions,
  bookings: [],
  orders: [],
  inventory: []
};

export const findUserByUsername = (username) => {
  return demoUsers.find(user => user.username === username);
};

export const findUserById = (id) => {
  return demoUsers.find(user => user._id === id);
};