import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const ChatbotConfigPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [chatbot, setChatbot] = useState({
    name: '',
    settings: {
      welcomeMessage: {
        en: 'Hello! How can I help you today?',
        rw: 'Muraho! Nigute nabafasha?'
      },
      fallbackMessage: {
        en: "I'm sorry, I didn't understand that. Could you please rephrase?",
        rw: 'Mbabarira, ntabwo nasobanukiwe. Nyamuneka subiramo ukundi?'
      },
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      fontFamily: 'Inter',
      position: 'bottom-right',
      aiModel: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 150,
      language: 'both'
    },
    isActive: true
  })

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    if (id) {
      fetchChatbot()
    }

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [id])

  const fetchChatbot = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/chatbot/${id}`)
      setChatbot(response.data)
    } catch (error) {
      toast.error('Failed to load chatbot')
      navigate('/dashboard/chatbot')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (id) {
        await axiosInstance.put(`/chatbot/${id}`, chatbot)
        toast.success('Chatbot updated successfully!')
      } else {
        const response = await axiosInstance.post('/chatbot', chatbot)
        navigate(`/dashboard/chatbot/${response.data._id}`)
        toast.success('Chatbot created successfully!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save chatbot')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setChatbot(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSettingChange = (field, value) => {
    setChatbot(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }))
  }

  const handleNestedSettingChange = (parent, field, value) => {
    setChatbot(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [parent]: {
          ...prev.settings[parent],
          [field]: value
        }
      }
    }))
  }

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️', mobileIcon: '⚙️' },
    { id: 'messages', name: 'Messages', icon: '💬', mobileIcon: '💬' },
    { id: 'appearance', name: 'Appearance', icon: '🎨', mobileIcon: '🎨' },
    { id: 'ai', name: 'AI', icon: '🤖', mobileIcon: '🤖' },
    { id: 'integrations', name: 'Integrations', icon: '🔌', mobileIcon: '🔗' },
    { id: 'preview', name: 'Preview', icon: '👁️', mobileIcon: '👁️' }
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
      <div className="max-w-4xl mx-auto pb-20 md:pb-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-8">
          <div className="mb-3 sm:mb-0">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {id ? 'Configure Chatbot' : 'Create New Chatbot'}
            </h1>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Customize your AI chatbot's behavior and appearance
            </p>
          </div>
          <div className="flex gap-2 md:gap-4">
            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'md'}
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size={isMobile ? 'sm' : 'md'}
              onClick={handleSave}
              isLoading={saving}
              className="flex-1 sm:flex-none"
            >
              {id ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>

        {/* Chatbot Name - Full width on mobile */}
        <div className="mb-4 md:mb-8">
          <Input
            label="Chatbot Name"
            type="text"
            value={chatbot.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Customer Support Bot"
            required
          />
        </div>

        {/* Mobile Tab Selector (Dropdown) */}
        {isMobile && (
          <div className="mb-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-base"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.icon} {tab.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tablet/Desktop Tabs */}
        {!isMobile && (
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 md:mb-8 overflow-x-auto hide-scrollbar">
            <nav className={`flex ${isTablet ? 'space-x-2' : 'space-x-4'} min-w-max`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 md:pb-4 px-2 md:px-4 flex items-center space-x-1 md:space-x-2 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="text-base md:text-xl">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Content - Mobile Optimized */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg p-4 md:p-8"
        >
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Language Settings</h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Supported Languages
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {['english', 'kinyarwanda', 'both'].map((lang) => (
                        <label key={lang} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="language"
                            value={lang}
                            checked={chatbot.settings.language === lang}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm capitalize">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Chatbot Status</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {['Active', 'Inactive'].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="status"
                        checked={status === 'Active' ? chatbot.isActive : !chatbot.isActive}
                        onChange={() => handleChange('isActive', status === 'Active')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Settings */}
          {activeTab === 'messages' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Welcome Message</h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">
                      English 🇬🇧
                    </label>
                    <textarea
                      value={chatbot.settings.welcomeMessage.en}
                      onChange={(e) => handleNestedSettingChange('welcomeMessage', 'en', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      placeholder="Welcome message in English..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">
                      Kinyarwanda 🇷🇼
                    </label>
                    <textarea
                      value={chatbot.settings.welcomeMessage.rw}
                      onChange={(e) => handleNestedSettingChange('welcomeMessage', 'rw', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      placeholder="Ubutumero bwo kwakira mu Kinyarwanda..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Fallback Message</h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">
                      English 🇬🇧
                    </label>
                    <textarea
                      value={chatbot.settings.fallbackMessage.en}
                      onChange={(e) => handleNestedSettingChange('fallbackMessage', 'en', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">
                      Kinyarwanda 🇷🇼
                    </label>
                    <textarea
                      value={chatbot.settings.fallbackMessage.rw}
                      onChange={(e) => handleNestedSettingChange('fallbackMessage', 'rw', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={chatbot.settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      className="w-10 h-10 md:w-12 md:h-12 rounded border border-gray-300"
                    />
                    <Input
                      type="text"
                      value={chatbot.settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={chatbot.settings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 md:w-12 md:h-12 rounded border border-gray-300"
                    />
                    <Input
                      type="text"
                      value={chatbot.settings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      placeholder="#1e40af"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">
                  Font Family
                </label>
                <select
                  value={chatbot.settings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                >
                  <option value="Inter">Inter</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">
                  Widget Position
                </label>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {['bottom-right', 'bottom-left', 'top-right', 'top-left'].map((position) => (
                    <label key={position} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="position"
                        value={position}
                        checked={chatbot.settings.position === position}
                        onChange={(e) => handleSettingChange('position', e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs md:text-sm capitalize">{position.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeTab === 'ai' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">
                  AI Model
                </label>
                <select
                  value={chatbot.settings.aiModel}
                  onChange={(e) => handleSettingChange('aiModel', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                  <option value="gpt-4">GPT-4 (More accurate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">
                  Temperature ({chatbot.settings.temperature})
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={chatbot.settings.temperature}
                  onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">
                  Max Tokens ({chatbot.settings.maxTokens})
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={chatbot.settings.maxTokens}
                  onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Short</span>
                  <span>Long</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-base md:text-lg font-semibold mb-4">Chat Preview</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 md:p-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white text-xs md:text-sm flex-shrink-0">
                        B
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 max-w-[80%] shadow-sm">
                        <p className="text-xs md:text-sm">{chatbot.settings.welcomeMessage.en}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 justify-end">
                      <div className="bg-primary text-white rounded-lg p-2 md:p-3 max-w-[80%] shadow-sm">
                        <p className="text-xs md:text-sm">I have a question</p>
                      </div>
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs md:text-sm flex-shrink-0">
                        U
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Preview */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center py-8">
                Integration settings moved to Integrations page
              </p>
            </div>
          )}
        </motion.div>

        {/* Mobile Save Button (Fixed at bottom) */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              isLoading={saving}
              className="w-full"
            >
              {id ? 'Save Changes' : 'Create Chatbot'}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ChatbotConfigPage