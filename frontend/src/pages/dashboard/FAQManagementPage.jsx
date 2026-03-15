import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const FAQManagementPage = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formData, setFormData] = useState({
    category: 'general',
    question: {
      en: '',
      rw: ''
    },
    answer: {
      en: '',
      rw: ''
    },
    keywords: [],
    priority: 0
  })
  const [keywordInput, setKeywordInput] = useState('')

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📋' },
    { id: 'general', name: 'General', icon: '📌' },
    { id: 'pricing', name: 'Pricing', icon: '💰' },
    { id: 'hours', name: 'Business Hours', icon: '🕐' },
    { id: 'location', name: 'Location', icon: '📍' },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'support', name: 'Support', icon: '🆘' },
    { id: 'other', name: 'Other', icon: '📁' }
  ]

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/faqs')
      setFaqs(response.data.faqs || response.data)
    } catch (error) {
      toast.error('Failed to load FAQs')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq)
      setFormData({
        category: faq.category,
        question: {
          en: faq.question.en || '',
          rw: faq.question.rw || ''
        },
        answer: {
          en: faq.answer.en || '',
          rw: faq.answer.rw || ''
        },
        keywords: faq.keywords || [],
        priority: faq.priority || 0
      })
    } else {
      setEditingFaq(null)
      setFormData({
        category: 'general',
        question: { en: '', rw: '' },
        answer: { en: '', rw: '' },
        keywords: [],
        priority: 0
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFaq(null)
    setKeywordInput('')
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      })
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.question.en || !formData.answer.en) {
      toast.error('English question and answer are required')
      return
    }

    try {
      if (editingFaq) {
        await axiosInstance.put(`/faqs/${editingFaq._id}`, formData)
        toast.success('FAQ updated successfully!')
      } else {
        await axiosInstance.post('/faqs', formData)
        toast.success('FAQ created successfully!')
      }
      fetchFAQs()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save FAQ')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await axiosInstance.delete(`/faqs/${id}`)
        toast.success('FAQ deleted successfully!')
        fetchFAQs()
      } catch (error) {
        toast.error('Failed to delete FAQ')
      }
    }
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = 
      faq.question.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.question.rw?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || '📌'
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              FAQ Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your frequently asked questions in English and Kinyarwanda
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="mt-4 md:mt-0"
          >
            + Add New FAQ
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search FAQs by question, answer, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<span className="text-gray-400">🔍</span>}
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* FAQs List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No FAQs Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first FAQ'}
            </p>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Add Your First FAQ
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(faq.category)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {faq.question.en}
                      </h3>
                      {faq.question.rw && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          🇷🇼 {faq.question.rw}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                      Priority: {faq.priority}
                    </span>
                    <button
                      onClick={() => handleOpenModal(faq)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="ml-11 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">🇬🇧 Answer:</span> {faq.answer.en}
                    </p>
                    {faq.answer.rw && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="font-medium">🇷🇼 Igisubizo:</span> {faq.answer.rw}
                      </p>
                    )}
                  </div>

                  {faq.keywords && faq.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {faq.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-400">
                    <span>Used {faq.usageCount || 0} times</span>
                    <span className="mx-2">•</span>
                    <span>Last updated: {new Date(faq.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold">
                    {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* English Question & Answer */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-l-4 border-primary pl-3">
                      🇬🇧 English
                    </h3>
                    <div>
                      <label className="block text-sm font-medium mb-2">Question *</label>
                      <textarea
                        value={formData.question.en}
                        onChange={(e) => setFormData({
                          ...formData,
                          question: {...formData.question, en: e.target.value}
                        })}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                        placeholder="Enter the question in English..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Answer *</label>
                      <textarea
                        value={formData.answer.en}
                        onChange={(e) => setFormData({
                          ...formData,
                          answer: {...formData.answer, en: e.target.value}
                        })}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                        placeholder="Enter the answer in English..."
                        required
                      />
                    </div>
                  </div>

                  {/* Kinyarwanda Question & Answer */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-l-4 border-green-500 pl-3">
                      🇷🇼 Kinyarwanda (Optional)
                    </h3>
                    <div>
                      <label className="block text-sm font-medium mb-2">Question</label>
                      <textarea
                        value={formData.question.rw}
                        onChange={(e) => setFormData({
                          ...formData,
                          question: {...formData.question, rw: e.target.value}
                        })}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                        placeholder="Andika ikibazo mu Kinyarwanda..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Answer</label>
                      <textarea
                        value={formData.answer.rw}
                        onChange={(e) => setFormData({
                          ...formData,
                          answer: {...formData.answer, rw: e.target.value}
                        })}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                        placeholder="Andika igisubizo mu Kinyarwanda..."
                      />
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Keywords</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add a keyword..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      />
                      <Button type="button" variant="secondary" onClick={handleAddKeyword}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
                        >
                          #{keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-2 text-xs hover:text-red-500"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Priority ({formData.priority})
                    </label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Lower Priority</span>
                      <span>Higher Priority</span>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="ghost" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}

export default FAQManagementPage