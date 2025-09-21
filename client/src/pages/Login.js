import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Lock, User, Building, Crown, Star, Shield, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isLoading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const demoCredentials = [
    { role: 'Admin', username: 'admin', password: 'admin123' },
    { role: 'Hotel Manager', username: 'hotelmanager', password: 'hotel123' },
    { role: 'Restaurant Manager', username: 'restmanager', password: 'restaurant123' },
    { role: 'Waiter', username: 'waiter1', password: 'waiter123' },
    { role: 'Receptionist', username: 'receptionist1', password: 'reception123' },
    { role: 'Accountant', username: 'accountant1', password: 'accounting123' },
  ];

  const fillDemoCredentials = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
        <div className="absolute inset-0">
          {/* Floating shapes */}
          <motion.div
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [20, -20, 20],
              rotate: [360, 180, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-1/2 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [-30, 30, -30],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-300/20 to-teal-400/20 rounded-full blur-xl"
          />
        </div>
      </div>
      
      <div className="max-w-6xl w-full relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center mb-8 relative"
              >
                <div className="relative">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity, 
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-lg"
                  />
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-xl">
                    <Building className="h-16 w-16 text-white" />
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut"
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <Crown className="h-8 w-8 text-yellow-400 drop-shadow-lg" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      y: [-2, 2, -2],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute -bottom-1 -left-1"
                  >
                    <Star className="h-6 w-6 text-yellow-300 drop-shadow-lg" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight"
              >
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm"
                >
                  Heritage 360
                </motion.span>
                <br />
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-gray-800 dark:text-gray-200 text-4xl lg:text-5xl"
                >
                  Buzz System
                </motion.span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-lg"
              >
                🏨 Complete hospitality management solution for hotels, restaurants, and pub services.
                ✨ Experience seamless operations with our professional-grade dashboard.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: '🏨', label: 'Hotel Management', desc: 'Room bookings & Guest services' },
                  { icon: '🍽️', label: 'Restaurant POS', desc: 'Orders & Menu management' },
                  { icon: '🍺', label: 'Pub Services', desc: 'Inventory & Sales tracking' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="group text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <motion.div 
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                      className="text-4xl mb-3"
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {feature.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {feature.desc}
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.8 + index * 0.2, duration: 0.8 }}
                      className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-3 mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            className="w-full max-w-md mx-auto"
          >
            <div 
              className="backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Header with gradient background */}
              <div className="relative bg-gradient-to-br from-yellow-400/10 to-orange-500/10 px-8 py-8 text-center border-b border-white/10">
                <div className="lg:hidden mb-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative mx-auto w-16 h-16"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-sm opacity-50" />
                    <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full">
                      <Building className="h-10 w-10 text-white" />
                    </div>
                  </motion.div>
                </div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl font-bold font-serif bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                >
                  Welcome Back
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-gray-600 dark:text-gray-400 mt-2 text-sm"
                >
                  🎆 Sign in to your Heritage 360 account
                </motion.p>
                
                {/* Decorative elements */}
                <div className="absolute top-2 right-2">
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Shield className="h-4 w-4 text-yellow-400/60" />
                  </motion.div>
                </div>
                <div className="absolute bottom-2 left-2">
                  <motion.div
                    animate={{ y: [-2, 2, -2], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <Award className="h-4 w-4 text-orange-400/60" />
                  </motion.div>
                </div>
              </div>

              <div className="px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      👤 Username
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors duration-200" />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 dark:focus:border-yellow-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-orange-500/0 to-yellow-400/0 group-focus-within:from-yellow-400/5 group-focus-within:via-orange-500/5 group-focus-within:to-yellow-400/5 transition-all duration-300 pointer-events-none" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🔐 Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors duration-200" />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 dark:focus:border-yellow-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors duration-200" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors duration-200" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-orange-500/0 to-yellow-400/0 group-focus-within:from-yellow-400/5 group-focus-within:via-orange-500/5 group-focus-within:to-yellow-400/5 transition-all duration-300 pointer-events-none" />
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="btn-primary w-full py-3 text-base font-semibold"
                  >
                    {isSubmitting || isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner h-5 w-5 mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Demo Credentials */}
              <div className="px-8 py-6 border-t border-white/10 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
                <div className="text-center">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4"
                  >
                    ✨ Quick Demo Access:
                  </motion.p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {demoCredentials.map((cred, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => fillDemoCredentials(cred.username, cred.password)}
                        className="p-3 text-left bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 rounded-xl border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
                      >
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {cred.role}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          {cred.username}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;