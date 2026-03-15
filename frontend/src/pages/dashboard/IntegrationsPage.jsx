import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const IntegrationsPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('whatsapp')
  const [integrations, setIntegrations] = useState({
    whatsapp: {
      enabled: false,
      phoneNumber: '',
      apiKey: '',
      businessAccountId: '',
      verified: false
    },
    telegram: {
      enabled: false,
      botToken: '',
      botUsername: '',
      webhookUrl: '',
      verified: false
    },
    website: {
      enabled: true,
      widgetColor: '#2563eb',
      widgetPosition: 'bottom-right',
      customCss: '',
      domains: [window.location.origin]
    }
  })

  const [showToken, setShowToken] = useState({})
  const [copied, setCopied] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const response = await axiosInstance.get('/business/integrations')
      setIntegrations(prev => ({
        ...prev,
        ...response.data
      }))
    } catch (error) {
      toast.error('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await axiosInstance.put('/business/integrations', integrations)
      toast.success('Integrations saved successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save integrations')
    } finally {
      setSaving(false)
    }
  }

  const handleVerify = async (channel) => {
    setTesting(true)
    try {
      if (channel === 'whatsapp') {
        await axiosInstance.post('/business/integrations/whatsapp/verify', {
          phoneNumber: integrations.whatsapp.phoneNumber,
          apiKey: integrations.whatsapp.apiKey
        })
        setIntegrations(prev => ({
          ...prev,
          whatsapp: { ...prev.whatsapp, verified: true }
        }))
        toast.success('WhatsApp integration verified!')
      } else if (channel === 'telegram') {
        await axiosInstance.post('/business/integrations/telegram/verify', {
          botToken: integrations.telegram.botToken,
          botUsername: integrations.telegram.botUsername
        })
        setIntegrations(prev => ({
          ...prev,
          telegram: { ...prev.telegram, verified: true }
        }))
        toast.success('Telegram bot verified!')
      }
    } catch (error) {
      toast.error(`Verification failed: ${error.response?.data?.message || 'Invalid credentials'}`)
    } finally {
      setTesting(false)
    }
  }

  const handleTestMessage = async (channel) => {
    if (!testMessage) {
      toast.error('Please enter a test message')
      return
    }

    setTesting(true)
    try {
      await axiosInstance.post(`/api/test/${channel}`, {
        message: testMessage,
        to: channel === 'whatsapp' ? integrations.whatsapp.phoneNumber : integrations.telegram.botUsername
      })
      toast.success(`Test message sent to ${channel}!`)
      setTestMessage('')
    } catch (error) {
      toast.error(`Failed to send test message: ${error.response?.data?.message}`)
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard!')
  }

  const generateWidgetCode = () => {
    const { widgetColor, widgetPosition } = integrations.website
    return `<!-- ChatRwanda Widget -->
<script>
  (function() {
    window.ChatRwandaConfig = {
      businessId: '${localStorage.getItem('businessId')}',
      color: '${widgetColor}',
      position: '${widgetPosition}',
      language: 'both'
    };
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '${window.location.origin}/widget.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
<!-- End ChatRwanda Widget -->`
  }

  const tabs = [
    { id: 'whatsapp', name: 'WhatsApp Business', icon: '📱', color: '#25D366' },
    { id: 'telegram', name: 'Telegram Bot', icon: '✈️', color: '#26A5E4' },
    { id: 'website', name: 'Website Widget', icon: '🌐', color: '#3b82f6' }
  ]

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Integrations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your chatbot with WhatsApp, Telegram, and your website
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
          >
            Save Changes
          </Button>
        </div>

        {/* Integration Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  style={activeTab === tab.id ? { borderBottomColor: tab.color } : {}}
                >
                  <span className="text-2xl mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* WhatsApp Integration */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">WhatsApp Business API</h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Connect your WhatsApp Business account to start chatting with customers
                      </p>
                    </div>
                    <label className="flex items-center">
                      <span className="mr-3 text-sm font-medium">Enable</span>
                      <input
                        type="checkbox"
                        checked={integrations.whatsapp.enabled}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          whatsapp: { ...integrations.whatsapp, enabled: e.target.checked }
                        })}
                        className="toggle"
                      />
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      📘 How to set up WhatsApp Business
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Business Manager</a></li>
                      <li>Create or select your WhatsApp Business account</li>
                      <li>Navigate to WhatsApp API settings</li>
                      <li>Copy your Phone Number ID and API Key</li>
                      <li>Paste them below and click Verify</li>
                    </ol>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Phone Number ID"
                      value={integrations.whatsapp.phoneNumber}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        whatsapp: { ...integrations.whatsapp, phoneNumber: e.target.value, verified: false }
                      })}
                      placeholder="e.g., 123456789012345"
                      disabled={!integrations.whatsapp.enabled}
                    />

                    <div>
                      <label className="block text-sm font-medium mb-2">API Key</label>
                      <div className="relative">
                        <Input
                          type={showToken.whatsapp ? 'text' : 'password'}
                          value={integrations.whatsapp.apiKey}
                          onChange={(e) => setIntegrations({
                            ...integrations,
                            whatsapp: { ...integrations.whatsapp, apiKey: e.target.value, verified: false }
                          })}
                          placeholder="Enter your WhatsApp API key"
                          disabled={!integrations.whatsapp.enabled}
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken({ ...showToken, whatsapp: !showToken.whatsapp })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showToken.whatsapp ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => handleVerify('whatsapp')}
                        disabled={!integrations.whatsapp.phoneNumber || !integrations.whatsapp.apiKey || testing}
                        isLoading={testing && activeTab === 'whatsapp'}
                      >
                        {integrations.whatsapp.verified ? '✓ Verified' : 'Verify Connection'}
                      </Button>
                      {integrations.whatsapp.verified && (
                        <span className="text-green-500 text-sm">✓ Connection successful</span>
                      )}
                    </div>

                    {integrations.whatsapp.verified && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="font-semibold mb-4">Send Test Message</h3>
                        <div className="flex gap-4">
                          <Input
                            value={testMessage}
                            onChange={(e) => setTestMessage(e.target.value)}
                            placeholder="Enter a test message..."
                            className="flex-1"
                          />
                          <Button
                            variant="secondary"
                            onClick={() => handleTestMessage('whatsapp')}
                            disabled={!testMessage || testing}
                          >
                            Send Test
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Telegram Integration */}
              {activeTab === 'telegram' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Telegram Bot</h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Connect your Telegram bot to handle customer inquiries
                      </p>
                    </div>
                    <label className="flex items-center">
                      <span className="mr-3 text-sm font-medium">Enable</span>
                      <input
                        type="checkbox"
                        checked={integrations.telegram.enabled}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          telegram: { ...integrations.telegram, enabled: e.target.checked }
                        })}
                        className="toggle"
                      />
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      🤖 How to create a Telegram Bot
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>Open Telegram and search for <strong>@BotFather</strong></li>
                      <li>Send <strong>/newbot</strong> and follow the instructions</li>
                      <li>Choose a name and username for your bot</li>
                      <li>Copy the HTTP API token provided by BotFather</li>
                      <li>Enter the token below and click Verify</li>
                    </ol>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Bot Token"
                      value={integrations.telegram.botToken}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        telegram: { ...integrations.telegram, botToken: e.target.value, verified: false }
                      })}
                      placeholder="e.g., 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                      disabled={!integrations.telegram.enabled}
                    />

                    <Input
                      label="Bot Username"
                      value={integrations.telegram.botUsername}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        telegram: { ...integrations.telegram, botUsername: e.target.value }
                      })}
                      placeholder="e.g., mybusiness_bot"
                      disabled={!integrations.telegram.enabled}
                    />

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => handleVerify('telegram')}
                        disabled={!integrations.telegram.botToken || testing}
                        isLoading={testing && activeTab === 'telegram'}
                      >
                        {integrations.telegram.verified ? '✓ Verified' : 'Verify Bot'}
                      </Button>
                      {integrations.telegram.verified && (
                        <span className="text-green-500 text-sm">✓ Bot is active</span>
                      )}
                    </div>

                    {integrations.telegram.verified && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="font-semibold mb-4">Send Test Message</h3>
                        <div className="flex gap-4">
                          <Input
                            value={testMessage}
                            onChange={(e) => setTestMessage(e.target.value)}
                            placeholder="Enter a test message..."
                            className="flex-1"
                          />
                          <Button
                            variant="secondary"
                            onClick={() => handleTestMessage('telegram')}
                            disabled={!testMessage || testing}
                          >
                            Send Test
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Website Widget */}
              {activeTab === 'website' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Website Widget</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Add the chat widget to your website with one line of code
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Widget Color</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="color"
                          value={integrations.website.widgetColor}
                          onChange={(e) => setIntegrations({
                            ...integrations,
                            website: { ...integrations.website, widgetColor: e.target.value }
                          })}
                          className="w-12 h-12 rounded border border-gray-300"
                        />
                        <Input
                          type="text"
                          value={integrations.website.widgetColor}
                          onChange={(e) => setIntegrations({
                            ...integrations,
                            website: { ...integrations.website, widgetColor: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Widget Position</label>
                      <select
                        value={integrations.website.widgetPosition}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          website: { ...integrations.website, widgetPosition: e.target.value }
                        })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Allowed Domains</label>
                    <div className="space-y-2">
                      {integrations.website.domains.map((domain, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={domain}
                            onChange={(e) => {
                              const newDomains = [...integrations.website.domains]
                              newDomains[index] = e.target.value
                              setIntegrations({
                                ...integrations,
                                website: { ...integrations.website, domains: newDomains }
                              })
                            }}
                            placeholder="https://yourwebsite.com"
                          />
                          <Button
                            variant="ghost"
                            onClick={() => {
                              const newDomains = integrations.website.domains.filter((_, i) => i !== index)
                              setIntegrations({
                                ...integrations,
                                website: { ...integrations.website, domains: newDomains }
                              })
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIntegrations({
                          ...integrations,
                          website: {
                            ...integrations.website,
                            domains: [...integrations.website.domains, '']
                          }
                        })}
                      >
                        + Add Domain
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Custom CSS (Optional)</label>
                    <textarea
                      value={integrations.website.customCss}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        website: { ...integrations.website, customCss: e.target.value }
                      })}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 font-mono text-sm"
                      placeholder="/* Add custom styles here */"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">📋 Widget Installation Code</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Copy and paste this code right before the closing <code>&lt;/body&gt;</code> tag on your website.
                    </p>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        {generateWidgetCode()}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(generateWidgetCode())}
                        className="absolute top-2 right-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                      >
                        {copied ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                      ⚡ Live Preview
                    </h3>
                    <div className="relative h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      {/* Widget Preview */}
                      <div className={`absolute ${integrations.website.widgetPosition === 'bottom-right' ? 'bottom-4 right-4' :
                          integrations.website.widgetPosition === 'bottom-left' ? 'bottom-4 left-4' :
                          integrations.website.widgetPosition === 'top-right' ? 'top-4 right-4' :
                          'top-4 left-4'
                        }`}>
                        <button
                          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
                          style={{ backgroundColor: integrations.website.widgetColor }}
                        >
                          💬
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {tabs.map((tab) => {
            const isConnected = tab.id === 'whatsapp' 
              ? integrations.whatsapp.verified
              : tab.id === 'telegram'
                ? integrations.telegram.verified
                : true
            
            return (
              <div
                key={tab.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${
                  isConnected ? 'border-l-4 border-green-500' : 'opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </div>
                  {isConnected ? (
                    <span className="text-green-500 text-sm">✓ Connected</span>
                  ) : (
                    <span className="text-gray-400 text-sm">Not Connected</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default IntegrationsPage