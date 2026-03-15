import React from 'react'

const ResponsiveTable = ({ 
  data, 
  columns, 
  mobileCard = true,
  emptyMessage = 'No data available'
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

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="text-4xl md:text-6xl mb-3 md:mb-4">📭</div>
        <p className="text-sm md:text-base text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  // Mobile card view
  if (isMobile && mobileCard) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="w-1/3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {column.header}:
                </span>
                <span className="w-2/3 text-sm text-gray-900 dark:text-white">
                  {column.accessor ? item[column.accessor] : column.cell?.(item)}
                </span>
              </div>
            ))}
            
            {/* Actions */}
            {columns.some(col => col.actions) && (
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {columns.find(col => col.actions)?.actions?.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={() => action.onClick(item)}
                    className="p-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {column.accessor ? item[column.accessor] : column.cell?.(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveTable