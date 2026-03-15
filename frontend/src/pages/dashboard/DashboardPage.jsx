import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import axiosInstance from '../../api/axios'

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    botResponseRate: 0,
    satisfaction: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    fetchDashboardData()
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        axiosInstance.get('/analytics/overview'),
        axiosInstance.get('/analytics/conversations?limit=5')
      ])
      
      setStats(statsRes.data)
      setRecentActivity(activityRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Configure Bot',
      description: 'Set up your AI chatbot',
      icon: '🤖',
      color: 'from-blue-500 to-cyan-500',
      link: '/dashboard/chatbot'
    },
    {
      title: 'Add FAQs',
      description: 'Train your bot',
      icon: '📚',
      color: 'from-green-500 to-emerald-500',
      link: '/dashboard/faqs'
    },
    {
      title: 'View Stats',
      description: 'See performance',
      icon: '📊',
      color: 'from-purple-500 to-pink-500',
      link: '/dashboard/analytics'
    },
    {
      title: 'Connect',
      description: 'Add integrations',
      icon: '🔌',
      color: 'from-orange-500 to-red-500',
      link: '/dashboard/integrations'
    }
  ]

  const statCards = [
    {
      label: 'Conversations',
      value: stats.totalConversations || 0,
      icon: '💬',
      color: 'bg-blue-500'
    },
    {
      label: 'Messages',
      value: stats.totalMessages || 0,
      icon: '📨',
      color: 'bg-green-500'
    },
    {
      label: 'Bot Rate',
      value: `${stats.botResponseRate || 0}%`,
      icon: '🤖',
      color: 'bg-purple-500'
    },
    {
      label: 'Satisfaction',
      value: `${stats.satisfaction || 0}%`,
      icon: '⭐',
      color: 'bg-yellow-500'
    }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Welcome Banner - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white mb-4 md:mb-8"
      >
        <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm md:text-base text-white/90 mb-3 md:mb-4">
          {isMobile 
            ? 'Your AI assistant is ready 24/7'
            : 'Your AI customer support is ready to help your customers 24/7.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/dashboard/chatbot" className="w-full sm:w-auto">
            <Button variant="secondary" size={isMobile ? 'sm' : 'md'} className="w-full sm:w-auto">
              Configure Bot
            </Button>
          </Link>
          <Link to="/dashboard/faqs" className="w-full sm:w-auto">
            <Button variant="outline" size={isMobile ? 'sm' : 'md'} className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20">
              Add FAQs
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow p-3 md:p-6"
          >
            <div className={`${stat.color} w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-lg md:text-2xl mb-2 md:mb-4`}>
              {stat.icon}
            </div>
            <div className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions - Horizontal Scroll on Mobile */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-6">
          Quick Actions
        </h2>
        <div className={`${isMobile ? 'flex overflow-x-auto gap-3 pb-2 -mx-4 px-4' : 'grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'}`}>
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${isMobile ? 'flex-shrink-0 w-48' : ''}`}
            >
              <Link to={action.link}>
                <div className={`bg-gradient-to-r ${action.color} rounded-lg md:rounded-xl p-3 md:p-6 text-white h-full`}>
                  <div className="text-2xl md:text-4xl mb-2 md:mb-4">{action.icon}</div>
                  <h3 className="text-sm md:text-lg font-semibold mb-1">{action.title}</h3>
                  <p className="text-xs md:text-sm text-white/80">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity - Stack on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            Recent Activity
          </h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {recentActivity.slice(0, isMobile ? 3 : 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm md:text-base">
                      💬
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                        New conversation
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    {activity.channel}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 md:py-8">
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">📭</div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">No recent activity</p>
            </div>
          )}
        </div>

        {/* Tips - Full width on mobile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            💡 Quick Tips
          </h2>
          <div className="space-y-3 md:space-y-4">
            <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 text-sm md:text-base mb-1">
                Train Your Bot
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Add at least 10 FAQs for better responses
              </p>
            </div>
            <div className="p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-600 dark:text-green-400 text-sm md:text-base mb-1">
                Kinyarwanda Support
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Add answers in both languages
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage