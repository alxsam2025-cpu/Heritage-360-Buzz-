export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      name: 'Heritage 360 Buzz API',
      version: '1.0.0',
      description: 'Comprehensive hotel, restaurant, and pub management system',
      deployment: 'Vercel Serverless',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      endpoints: [
        'GET /api/health - Health check',
        'POST /api/auth/login - User login',
        'GET /api/auth/me - Get current user profile',
        'GET /api/hotel/* - Hotel management endpoints',
        'GET /api/restaurant/* - Restaurant management endpoints',
        'GET /api/pub/* - Pub management endpoints',
        'GET /api/accounting/* - Accounting endpoints',
        'GET /api/inventory/* - Inventory management endpoints',
        'GET /api/reports/* - Reports and analytics endpoints'
      ],
      demo_users: [
        { username: 'admin', password: 'admin123', role: 'System Administrator' },
        { username: 'hotelmanager', password: 'hotel123', role: 'Hotel Manager' },
        { username: 'restmanager', password: 'restaurant123', role: 'Restaurant Manager' },
        { username: 'waiter1', password: 'waiter123', role: 'Waiter Staff' },
        { username: 'receptionist1', password: 'reception123', role: 'Front Desk' },
        { username: 'accountant1', password: 'accounting123', role: 'Chief Accountant' }
      ],
      features: [
        '🏨 Hotel Booking System (USD)',
        '🍽️ Restaurant POS (GHS)',
        '🍺 Pub Management (GHS)', 
        '💰 Multi-Currency Accounting',
        '📦 Inventory Management',
        '👥 Role-Based Access Control',
        '📊 Business Analytics',
        '🎨 7 Custom Themes',
        '📱 Mobile Responsive'
      ]
    });
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}