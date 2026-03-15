import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalConversations: 0,
      totalMessages: 0,
      botMessages: 0,
      resolvedConversations: 0,
      botResponseRate: 0,
      resolutionRate: 0
    },
    conversationsByDay: [],
    messagesByType: [],
    popularFAQs: [],
    satisfactionData: {
      average: 0,
      total: 0,
      distribution: []
    },
    performance: [],
    channels: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch(dateRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(startDate.getDate() - 90)
          break
        case '12m':
          startDate.setMonth(startDate.getMonth() - 12)
          break
      }

      const [overviewRes, conversationsRes, performanceRes, satisfactionRes] = await Promise.all([
        axiosInstance.get('/analytics/overview', {
          params: { startDate, endDate }
        }),
        axiosInstance.get('/analytics/conversations', {
          params: { startDate, endDate }
        }),
        axiosInstance.get('/analytics/performance', {
          params: { startDate, endDate }
        }),
        axiosInstance.get('/analytics/satisfaction', {
          params: { startDate, endDate }
        })
      ])

      // Generate mock data for demonstration
      // In production, this would come from your backend
      setAnalytics({
        overview: overviewRes.data,
        conversationsByDay: generateConversationData(dateRange),
        messagesByType: [
          { name: 'Bot Messages', value: 1240, color: '#3b82f6' },
          { name: 'Human Messages', value: 360, color: '#10b981' },
          { name: 'Unresolved', value: 120, color: '#ef4444' }
        ],
        popularFAQs: [
          { question: 'What are your business hours?', count: 156, language: 'en' },
          { question: 'Mukora saa ngabe?', count: 89, language: 'rw' },
          { question: 'How much does it cost?', count: 78, language: 'en' },
          { question: 'Where are you located?', count: 67, language: 'en' },
          { question: 'Ibicuruzwa byanyu bihenze iki?', count: 45, language: 'rw' }
        ],
        satisfactionData: {
          average: 4.5,
          total: 1250,
          distribution: [
            { rating: 5, count: 680, color: '#10b981' },
            { rating: 4, count: 350, color: '#3b82f6' },
            { rating: 3, count: 140, color: '#f59e0b' },
            { rating: 2, count: 50, color: '#f97316' },
            { rating: 1, count: 30, color: '#ef4444' }
          ]
        },
        performance: generatePerformanceData(dateRange),
        channels: [
          { name: 'Website', value: 45, color: '#3b82f6' },
          { name: 'WhatsApp', value: 30, color: '#25D366' },
          { name: 'Telegram', value: 25, color: '#26A5E4' }
        ]
      })
    } catch (error) {
      toast.error('Failed to load analytics')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const generateConversationData = (range) => {
    const data = []
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
    const today = new Date()
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        conversations: Math.floor(Math.random() * 30) + 10,
        resolved: Math.floor(Math.random() * 25) + 5,
        botHandled: Math.floor(Math.random() * 20) + 10
      })
    }
    return data
  }

  const generatePerformanceData = (range) => {
    const data = []
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 12
    const today = new Date()
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today)
      if (range === '12m') {
        date.setMonth(date.getMonth() - i)
        data.push({
          period: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          responseTime: Math.floor(Math.random() * 30) + 20,
          satisfaction: Math.floor(Math.random() * 20) + 70
        })
      } else {
        date.setDate(date.getDate() - i)
        data.push({
          period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          responseTime: Math.floor(Math.random() * 30) + 20,
          satisfaction: Math.floor(Math.random() * 20) + 70
        })
      }
    }
    return data
  }

  const handleExport = async (format) => {
    try {
      const response = await axiosInstance.get('/analytics/export', {
        params: { format },
        responseType: format === 'csv' ? 'blob' : 'json'
      })
      
      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `analytics-${dateRange}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        // Handle JSON export
        const dataStr = JSON.stringify(response.data, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        const exportFileDefaultName = `analytics-${dateRange}.json`
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
      }
      
      toast.success(`Analytics exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('Failed to export analytics')
    }
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  const CHANNEL_COLORS = { Website: '#3b82f6', WhatsApp: '#25D366', Telegram: '#26A5E4' }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your chatbot's performance and customer interactions
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                📊 CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                📋 JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Conversations</span>
              <span className="text-2xl">💬</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.overview.totalConversations}
            </div>
            <div className="text-sm text-green-500 mt-2">↑ 12% from last period</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Bot Response Rate</span>
              <span className="text-2xl">🤖</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.overview.botResponseRate}%
            </div>
            <div className="text-sm text-green-500 mt-2">↑ 5% from last period</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Resolution Rate</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.overview.resolutionRate}%
            </div>
            <div className="text-sm text-green-500 mt-2">↑ 3% from last period</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Customer Satisfaction</span>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.satisfactionData.average}/5
            </div>
            <div className="text-sm text-yellow-500 mt-2">Based on {analytics.satisfactionData.total} reviews</div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Conversations Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Conversations Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.conversationsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="conversations" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="botHandled" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="resolved" stackId="3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Message Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Message Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.messagesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.messagesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Response Time & Satisfaction</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#3b82f6" name="Response Time (s)" />
                <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#10b981" name="Satisfaction (%)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Channel Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Conversations by Channel</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.channels}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6">
                  {analytics.channels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.name] || COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Most Popular FAQs</h2>
            <div className="space-y-4">
              {analytics.popularFAQs.map((faq, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </p>
                    <p className="text-xs text-gray-500">
                      {faq.language === 'en' ? '🇬🇧 English' : '🇷🇼 Kinyarwanda'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-primary mr-2">{faq.count}</span>
                    <span className="text-xs text-gray-500">times</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Satisfaction Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Customer Satisfaction Distribution</h2>
            <div className="space-y-4">
              {analytics.satisfactionData.distribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{item.rating} ⭐</span>
                      <span className="text-xs text-gray-500">{item.count} reviews</span>
                    </div>
                    <span className="text-sm font-medium">
                      {((item.count / analytics.satisfactionData.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.satisfactionData.total) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage