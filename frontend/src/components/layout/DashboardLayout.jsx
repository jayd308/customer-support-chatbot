import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', mobileIcon: '🏠' },
    { name: 'Chatbot', path: '/dashboard/chatbot', icon: '🤖', mobileIcon: '💬' },
    { name: 'FAQs', path: '/dashboard/faqs', icon: '📚', mobileIcon: '❓' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: '📈', mobileIcon: '📊' },
    { name: 'Integrations', path: '/dashboard/integrations', icon: '🔌', mobileIcon: '🔗' },
    { name: 'Team', path: '/dashboard/team', icon: '👥', mobileIcon: '👤' },
    { name: 'Billing', path: '/dashboard/billing', icon: '💰', mobileIcon: '💳' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️', mobileIcon: '⚙️' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Mobile bottom navigation
  const MobileBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex justify-around items-center h-16">
        {navigation.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              location.pathname === item.path
                ? 'text-primary'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="text-xl">{item.mobileIcon}</span>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 dark:text-gray-400"
        >
          <span className="text-xl">☰</span>
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30">
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ChatRwanda
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </header>
      )}

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navigation.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-primary text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Tablet/Desktop Sidebar */}
      {!isMobile && (
        <aside className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
          isTablet ? 'w-20' : 'w-64'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className={`font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent ${
                isTablet ? 'text-xl' : 'text-2xl'
              }`}>
                {isTablet ? 'CR' : 'ChatRwanda'}
              </span>
            </Link>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isTablet ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={isTablet ? item.name : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {!isTablet && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className={`flex items-center ${isTablet ? 'justify-center' : 'space-x-3'} mb-4`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              {!isTablet && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full ${isTablet ? 'px-2' : ''}`}
              onClick={handleLogout}
              title={isTablet ? 'Logout' : undefined}
            >
              {isTablet ? '🚪' : 'Logout'}
            </Button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`
        transition-all duration-300
        ${isMobile ? 'pt-16 px-4' : 'px-6'}
        ${!isMobile && (isTablet ? 'ml-20' : 'ml-64')}
      `}>
        <div className="max-w-7xl mx-auto py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  )
}

export default DashboardLayout