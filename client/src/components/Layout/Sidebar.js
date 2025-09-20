import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Hotel,
  UtensilsCrossed,
  Wine,
  Calculator,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  Home,
  Palette,
  LogOut,
  Crown
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onThemeClick }) => {
  const { user, logout, hasDepartmentAccess, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      access: () => true
    },
    {
      name: 'Hotel Management',
      href: '/hotel',
      icon: Hotel,
      access: () => hasDepartmentAccess('hotel') || hasDepartmentAccess('all'),
      badge: 'USD'
    },
    {
      name: 'Restaurant',
      href: '/restaurant',
      icon: UtensilsCrossed,
      access: () => hasDepartmentAccess('restaurant') || hasDepartmentAccess('all'),
      badge: 'GHS'
    },
    {
      name: 'Pub Services',
      href: '/pub',
      icon: Wine,
      access: () => hasDepartmentAccess('pub') || hasDepartmentAccess('all'),
      badge: 'GHS'
    },
    {
      name: 'Accounting',
      href: '/accounting',
      icon: Calculator,
      access: () => hasDepartmentAccess('accounting') || hasDepartmentAccess('all')
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Package,
      access: () => hasDepartmentAccess('store') || hasDepartmentAccess('all')
    },
    {
      name: 'Procurement',
      href: '/procurement',
      icon: ShoppingCart,
      access: () => hasDepartmentAccess('procurement') || hasDepartmentAccess('all')
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      access: () => hasPermission('reports', 'read')
    }
  ];

  const adminItems = [
    {
      name: 'User Management',
      href: '/users',
      icon: Users,
      access: () => user?.role === 'admin' || user?.role === 'manager'
    },
    {
      name: 'System Settings',
      href: '/settings',
      icon: Settings,
      access: () => user?.role === 'admin'
    }
  ];

  const isActive = (href) => {
    return location.pathname === href || 
           (href !== '/' && location.pathname.startsWith(href));
  };

  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    
    return (
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ type: "tween", duration: 0.15 }}
      >
        <button
          onClick={onClick}
          className={`${
            active ? 'nav-link-active' : 'nav-link-inactive'
          } w-full group relative`}
        >
          <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="truncate">{item.name}</span>
          {item.badge && (
            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
          {active && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
            />
          )}
        </button>
      </motion.div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-thin">
            
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <div className="relative">
                  <Building2 className="h-10 w-10 text-primary" />
                  <Crown className="h-4 w-4 text-accent absolute -top-1 -right-1" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold font-serif bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Heritage 360
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Buzz System
                  </p>
                </div>
              </motion.div>
            </div>

            {/* User Info */}
            <div className="mt-8 px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role?.replace('_', ' ')} • {user?.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-4 space-y-1">
              {navigationItems
                .filter(item => item.access())
                .map((item) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    onClick={() => navigate(item.href)}
                  />
                ))
              }

              {/* Admin Section */}
              {adminItems.some(item => item.access()) && (
                <div className="pt-6">
                  <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Administration
                  </div>
                  {adminItems
                    .filter(item => item.access())
                    .map((item) => (
                      <NavItem
                        key={item.name}
                        item={item}
                        onClick={() => navigate(item.href)}
                      />
                    ))
                  }
                </div>
              )}
            </nav>

            {/* Bottom Actions */}
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4 space-y-1">
              <button
                onClick={onThemeClick}
                className="nav-link-inactive w-full"
              >
                <Palette className="mr-3 h-5 w-5" />
                Theme Settings
              </button>
              
              <button
                onClick={handleLogout}
                className="nav-link-inactive w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-thin"
          >
            {/* Mobile content - same as desktop but with onClose handlers */}
            <div className="flex flex-col h-full">
              
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 px-6 py-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <div className="relative">
                    <Building2 className="h-10 w-10 text-primary" />
                    <Crown className="h-4 w-4 text-accent absolute -top-1 -right-1" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold font-serif bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Heritage 360
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Buzz System
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* User Info */}
              <div className="px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role?.replace('_', ' ')} • {user?.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-8 flex-1 px-4 space-y-1">
                {navigationItems
                  .filter(item => item.access())
                  .map((item) => (
                    <NavItem
                      key={item.name}
                      item={item}
                      onClick={() => {
                        navigate(item.href);
                        onClose();
                      }}
                    />
                  ))
                }

                {/* Admin Section */}
                {adminItems.some(item => item.access()) && (
                  <div className="pt-6">
                    <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Administration
                    </div>
                    {adminItems
                      .filter(item => item.access())
                      .map((item) => (
                        <NavItem
                          key={item.name}
                          item={item}
                          onClick={() => {
                            navigate(item.href);
                            onClose();
                          }}
                        />
                      ))
                    }
                  </div>
                )}
              </nav>

              {/* Bottom Actions */}
              <div className="flex-shrink-0 flex-col border-t border-gray-200 dark:border-gray-700 p-4 space-y-1">
                <button
                  onClick={() => {
                    onThemeClick();
                    onClose();
                  }}
                  className="nav-link-inactive w-full"
                >
                  <Palette className="mr-3 h-5 w-5" />
                  Theme Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="nav-link-inactive w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;