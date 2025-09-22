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
      success: true,
      message: 'Heritage 360 Buzz API Test Endpoint',
      timestamp: new Date().toISOString(),
      features: {
        hotel: {
          status: 'operational',
          endpoints: ['/api/hotel/rooms', '/api/hotel/bookings']
        },
        restaurant: {
          status: 'operational', 
          endpoints: ['/api/restaurant/menu', '/api/restaurant/orders']
        },
        pub: {
          status: 'operational',
          endpoints: ['/api/pub/menu']
        },
        accounting: {
          status: 'operational',
          endpoints: ['/api/accounting/transactions']
        },
        inventory: {
          status: 'operational',
          endpoints: ['/api/inventory/items']
        }
      },
      demoData: {
        restaurantMenuItems: 6,
        pubBeverages: 6,
        hotelRooms: 5,
        inventoryItems: 5,
        sampleTransactions: 3
      }
    });
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}