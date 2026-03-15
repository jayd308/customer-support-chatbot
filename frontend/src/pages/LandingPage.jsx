import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

const LandingPage = () => {
  const { user } = useAuth()
  

  const features = [
    {
      title: 'Multi-Channel Support',
      description: 'Connect with customers on WhatsApp, Telegram, and your website from one platform.',
      icon: '📱',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'AI-Powered Responses',
      description: 'Automatically answer customer questions using advanced AI in English and Kinyarwanda.',
      icon: '🤖',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Smart Analytics',
      description: 'Track conversation metrics, customer satisfaction, and chatbot performance.',
      icon: '📊',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Easy Integration',
      description: 'Simple setup process to get your chatbot running in minutes, not hours.',
      icon: '⚡',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { value: '99%', label: 'Customer Satisfaction' },
    { value: '24/7', label: 'Always Available' },
    { value: '2x', label: 'Faster Responses' },
    { value: '500+', label: 'Active Businesses' }
  ]

  const testimonials = [
    {
      name: 'Jean Pierre',
      business: 'Kigali Mart',
      comment: 'ChatRwanda has transformed how we handle customer inquiries. Our response time dropped by 70%!',
      rating: 5
    },
    {
      name: 'Marie Claire',
      business: 'Rwanda Tech Solutions',
      comment: 'The Kinyarwanda support is excellent. Our customers love being able to ask questions in their native language.',
      rating: 5
    },
    {
      name: 'Paul Kagabo',
      business: 'Musanze Tours',
      comment: 'Setting up was incredibly easy. Now we never miss a customer inquiry, even after hours.',
      rating: 5
    }
  ]

  const faqs = [
    {
      question: 'How does the AI chatbot work?',
      answer: 'Our AI chatbot uses OpenAI technology to understand and respond to customer questions. You can train it with your own FAQs and it will learn to provide accurate answers.'
    },
    {
      question: 'Can I use both English and Kinyarwanda?',
      answer: 'Yes! ChatRwanda fully supports both English and Kinyarwanda. Your customers can ask questions in either language, and the bot will respond accordingly.'
    },
    {
      question: 'How do I integrate with WhatsApp?',
      answer: 'Simply connect your WhatsApp Business API key in the dashboard. We provide step-by-step instructions to make the process easy.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial with no credit card required. You can test all features before committing.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation - Shows different buttons based on auth status but NO redirects */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ChatRwanda
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">
                Pricing
              </Link>
              {user ? (
                // Show dashboard button but landing page stays accessible
                <Link to="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AI Customer Support
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                for Rwandan Businesses
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Automatically answer customer questions on WhatsApp, Telegram, and your website 
              with our AI chatbot. Available in English and Kinyarwanda.
            </p>
            <div className="flex gap-4 justify-center">
              {!user ? (
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8">
                    Start Free Trial
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for
              <span className="text-primary"> Customer Support</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features to help you provide instant, accurate responses to your customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in
              <span className="text-primary"> 3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Set up your AI customer support in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Account',
                description: 'Sign up for free and set up your business profile',
                icon: '📝'
              },
              {
                step: '2',
                title: 'Train Your Bot',
                description: 'Add FAQs and configure your chatbot responses',
                icon: '🎯'
              },
              {
                step: '3',
                title: 'Connect Channels',
                description: 'Integrate with WhatsApp, Telegram, and your website',
                icon: '🔌'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by
              <span className="text-primary"> Rwandan Businesses</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">"{testimonial.comment}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{testimonial.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked
              <span className="text-primary"> Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to know about ChatRwanda
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join hundreds of Rwandan businesses already using ChatRwanda
            </p>
            {!user ? (
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 text-lg px-8"
                >
                  Start Free Trial
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 text-lg px-8"
                >
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ChatRwanda</h3>
              <p className="text-gray-400">AI Customer Support for Rwandan Businesses</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#integrations" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#privacy" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#terms" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 ChatRwanda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage