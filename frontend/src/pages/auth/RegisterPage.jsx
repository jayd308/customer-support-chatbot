import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name) {
      newErrors.name = 'Full name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    
    if (result.success) {
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please login with your credentials.' 
        } 
      })
    }
    
    setIsLoading(false)
  }

  const plans = [
    { name: 'Free', price: '0 RWF', features: ['100 conversations/mo', 'Basic AI', '1 chatbot'] },
    { name: 'Pro', price: '29,000 RWF', features: ['Unlimited conversations', 'Advanced AI', 'Multiple channels'] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
      <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-800 opacity-50" />
      
      <div className="relative max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ChatRwanda
            </span>
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Start your free trial
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No credit card required. 14-day free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    icon={<span className="text-gray-400">👤</span>}
                    required
                  />

                  <Input
                    label="Business Name"
                    type="text"
                    name="businessName"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    error={errors.businessName}
                    icon={<span className="text-gray-400">🏢</span>}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<span className="text-gray-400">📧</span>}
                  required
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  name="phone"
                  placeholder="+250 788 123 456"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon={<span className="text-gray-400">📱</span>}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={<span className="text-gray-400">🔒</span>}
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={<span className="text-gray-400">🔒</span>}
                    required
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </a>
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Create Free Account
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
                  index === 1 ? 'border-2 border-primary' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {index === 1 && (
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">/mo</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="bg-primary/5 dark:bg-gray-700/50 rounded-xl p-6">
              <h4 className="font-semibold mb-2">✨ All plans include:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span> WhatsApp Integration
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span> Telegram Integration
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span> Website Widget
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span> English & Kinyarwanda
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span> Analytics Dashboard
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage