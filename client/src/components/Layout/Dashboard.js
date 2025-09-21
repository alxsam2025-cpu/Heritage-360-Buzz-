import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import ThemeSelector from './ThemeSelector';

const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              onClick={closeSidebar}
            >
              <div className="absolute inset-0 bg-gray-600/75 dark:bg-gray-900/75"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
          onThemeClick={() => setThemeModalOpen(true)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          
          {/* Header */}
          <Header 
            onMenuClick={toggleSidebar}
            onThemeClick={() => setThemeModalOpen(true)}
          />

          {/* Page content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="animate-fade-in-up"
                >
                  {children}
                </motion.div>
              </div>
            </div>
          </main>
        </div>

        {/* Theme Selector Modal */}
        <ThemeSelector 
          isOpen={themeModalOpen}
          onClose={() => setThemeModalOpen(false)}
        />

        {/* Notification Toast Container */}
        <div id="toast-container" className="fixed top-4 right-4 z-50 space-y-2">
          {/* Toast messages will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;