import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const BillingPage = () => {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState({
    plan: 'free',
    status: 'active',
    expiresAt: null,
    features: []
  })
  const [billingInfo, setBillingInfo] = useState({
    paymentMethod: 'credit_card',
    lastFour: '',
    expiryDate: '',
    billingEmail: '',
    companyName: '',
    taxId: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'RW'
    }
  })
  const [invoices, setInvoices] = useState([])
  const [usage, setUsage] = useState({
    conversationsThisMonth: 0,
    messagesThisMonth: 0,
    aiTokensUsed: 0,
    storageUsed: 0,
    apiCalls: 0
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      const [subscriptionRes, billingRes, invoicesRes, usageRes] = await Promise.all([
        axiosInstance.get('/business/subscription'),
        axiosInstance.get('/business/billing'),
        axiosInstance.get('/business/invoices'),
        axiosInstance.get('/business/usage')
      ])
      
      setSubscription(subscriptionRes.data)
      setBillingInfo(billingRes.data)
      setInvoices(invoicesRes.data)
      setUsage(usageRes.data)
    } catch (error) {
      toast.error('Failed to load billing information')
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0 RWF',
      priceUSD: '$0',
      period: 'month',
      features: [
        '100 conversations/month',
        'Basic AI responses',
        '1 chatbot',
        'Email support',
        'Basic analytics'
      ],
      limitations: [
        'No WhatsApp integration',
        'No Telegram integration',
        'Limited to 50 FAQs'
      ],
      color: 'from-gray-500 to-gray-600',
      recommended: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '29,000 RWF',
      priceUSD: '$15',
      period: 'month',
      features: [
        '1,000 conversations/month',
        'Advanced AI responses',
        '3 chatbots',
        'WhatsApp integration',
        'Telegram integration',
        'Unlimited FAQs',
        'Advanced analytics',
        'Email & chat support'
      ],
      color: 'from-blue-500 to-cyan-500',
      recommended: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '79,000 RWF',
      priceUSD: '$39',
      period: 'month',
      features: [
        '5,000 conversations/month',
        'Premium AI (GPT-4)',
        'Unlimited chatbots',
        'All integrations',
        'Custom branding',
        'Team members (5 users)',
        'API access',
        'Priority support',
        'SLA guarantee'
      ],
      color: 'from-purple-500 to-pink-500',
      recommended: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      priceUSD: 'Custom',
      period: 'month',
      features: [
        'Unlimited conversations',
        'Custom AI training',
        'Unlimited everything',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment',
        '24/7 phone support',
        'Custom SLA'
      ],
      color: 'from-orange-500 to-red-500',
      recommended: false
    }
  ]

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success(`Successfully upgraded to ${selectedPlan.name} plan!`)
      setShowPaymentModal(false)
      setSubscription({ ...subscription, plan: selectedPlan.id })
      setProcessing(false)
    }, 2000)
  }

  const getUsagePercentage = (used, limit) => {
    const limits = {
      free: { conversations: 100, messages: 500 },
      basic: { conversations: 1000, messages: 5000 },
      pro: { conversations: 5000, messages: 25000 },
      enterprise: { conversations: 100000, messages: 500000 }
    }
    
    const planLimits = limits[subscription.plan] || limits.free
    const percentage = (used / planLimits.conversations) * 100
    return Math.min(percentage, 100)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  const currentPlan = plans.find(p => p.id === subscription.plan) || plans[0]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Billing & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription, billing information, and view invoices
          </p>
        </div>

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-sm text-gray-500">Current Plan</span>
                <h2 className="text-2xl font-bold mt-1">{currentPlan.name}</h2>
              </div>
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${currentPlan.color} text-white text-sm`}>
                {subscription.status}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{currentPlan.price}</span>
                <span className="text-gray-500 ml-2">/{currentPlan.period}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Usage this month</h3>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conversations</span>
                  <span>{usage.conversationsThisMonth} / {
                    subscription.plan === 'free' ? '100' :
                    subscription.plan === 'basic' ? '1,000' :
                    subscription.plan === 'pro' ? '5,000' : '100,000'
                  }</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(usage.conversationsThisMonth, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Messages</span>
                  <span>{usage.messagesThisMonth} / {
                    subscription.plan === 'free' ? '500' :
                    subscription.plan === 'basic' ? '5,000' :
                    subscription.plan === 'pro' ? '25,000' : '500,000'
                  }</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(usage.messagesThisMonth / 1000) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-500">AI Tokens Used</div>
                  <div className="text-lg font-semibold">{usage.aiTokensUsed.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-500">API Calls</div>
                  <div className="text-lg font-semibold">{usage.apiCalls.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billing Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="font-semibold mb-4">Billing Information</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Payment Method</div>
                <div className="flex items-center mt-1">
                  <span className="text-2xl mr-2">💳</span>
                  <span>
                    {billingInfo.paymentMethod === 'credit_card' 
                      ? `Credit Card ending in ${billingInfo.lastFour || '****'}`
                      : 'Not set'
                    }
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Billing Email</div>
                <div className="mt-1">{billingInfo.billingEmail || 'Not set'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Company Name</div>
                <div className="mt-1">{billingInfo.companyName || 'Not set'}</div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowPaymentModal(true)}
              >
                Update Billing Info
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Available Plans */}
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${
                plan.id === subscription.plan ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  RECOMMENDED
                </div>
              )}
              
              <div className={`h-2 bg-gradient-to-r ${plan.color}`} />
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-400">
                      <span className="text-gray-400 mr-2">○</span>
                      {limitation}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.id === subscription.plan ? 'outline' : 'primary'}
                  className="w-full"
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.id === subscription.plan}
                >
                  {plan.id === subscription.plan ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Invoices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Invoice History</h2>
          
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Invoice #</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{invoice.number}</td>
                      <td className="py-3 px-4">{invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-primary hover:underline text-sm">
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-500">No invoices yet</p>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold">
                  {selectedPlan ? `Upgrade to ${selectedPlan.name}` : 'Update Billing Info'}
                </h2>
              </div>

              <form onSubmit={handlePayment} className="p-6 space-y-6">
                {selectedPlan && (
                  <div className="bg-primary/10 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span>{selectedPlan.name} Plan</span>
                      <span className="font-bold">{selectedPlan.price}/{selectedPlan.period}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your new plan will be active immediately
                    </p>
                  </div>
                )}

                <Input
                  label="Card Number"
                  placeholder="4242 4242 4242 4242"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVC"
                    placeholder="123"
                    required
                  />
                </div>

                <Input
                  label="Name on Card"
                  placeholder="John Doe"
                  required
                />

                <Input
                  label="Billing Address"
                  placeholder="Street address"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="Kigali"
                    required
                  />
                  <Input
                    label="Postal Code"
                    placeholder="00000"
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={processing}
                  >
                    {selectedPlan ? 'Upgrade Now' : 'Update Billing'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default BillingPage