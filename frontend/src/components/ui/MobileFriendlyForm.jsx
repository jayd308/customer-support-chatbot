import React from 'react'
import { motion } from 'framer-motion'

const MobileFriendlyForm = ({ 
  children, 
  onSubmit, 
  submitLabel = 'Submit',
  isLoading = false,
  layout = 'stacked' // stacked, grid, or inline
}) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="space-y-4 md:space-y-6"
    >
      <div className={`
        ${layout === 'grid' && !isMobile ? 'grid grid-cols-2 gap-4' : 'space-y-4'}
        ${layout === 'inline' && !isMobile ? 'flex gap-4 items-end' : ''}
      `}>
        {children}
      </div>

      <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:static md:p-0 md:bg-transparent md:border-0' : ''}`}>
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full md:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg
            hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${isMobile ? 'text-base' : 'text-sm'}
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>

      {/* Spacer for mobile fixed button */}
      {isMobile && <div className="h-20" />}
    </motion.form>
  )
}

export default MobileFriendlyForm