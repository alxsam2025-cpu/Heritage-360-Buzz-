const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Check for specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check for specific permissions
const checkPermission = (module, action) => {
  return (req, res, next) => {
    // Admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user has specific permission
    const hasPermission = req.user.permissions.some(permission => 
      permission.module === module && permission.actions.includes(action)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to ${action} ${module} resources`
      });
    }

    next();
  };
};

// Check department access
const checkDepartment = (requiredDepartments) => {
  return (req, res, next) => {
    // Admin and users with 'all' department access can access everything
    if (req.user.role === 'admin' || req.user.department === 'all') {
      return next();
    }

    // Check if user's department is in the required list
    const departmentArray = Array.isArray(requiredDepartments) 
      ? requiredDepartments 
      : [requiredDepartments];

    if (!departmentArray.includes(req.user.department)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient department privileges'
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  checkPermission,
  checkDepartment
};