import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ChatbotConfigPage from './pages/dashboard/ChatbotConfigPage' // Add this import
import FAQManagementPage from './pages/dashboard/FAQManagementPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage' // Add this import
import IntegrationsPage from './pages/dashboard/IntegrationsPage' // Add this import
import TeamManagementPage from './pages/dashboard/TeamManagementPage'
import BillingPage from './pages/dashboard/BillingPage'

const TempPage = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600">This page is under construction</p>
      <a href="/" className="text-primary hover:underline mt-4 inline-block">
        ← Back to Home
      </a>
    </div>
  </div>
)

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  console.log('PrivateRoute - user:', user, 'loading:', loading)
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!user) {
    console.log('PrivateRoute - No user, redirecting to login')
    return <Navigate to="/login" />
  }
  
  console.log('PrivateRoute - User found, rendering children')
  return children
}

function App() {
  const { user, loading } = useAuth()
  
  console.log('App rendered - current path:', window.location.pathname)
  console.log('App - user:', user, 'loading:', loading)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pricing" element={<TempPage title="Pricing Page" />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      
      {/* Chatbot Configuration Route - Now using the real component */}
      <Route path="/dashboard/chatbot/:id?" element={
        <PrivateRoute>
          <ChatbotConfigPage />
        </PrivateRoute>
      } />
      
     
// Then update the route:
<Route path="/dashboard/faqs" element={
  <PrivateRoute>
    <FAQManagementPage />
  </PrivateRoute>
} />
      
<Route path="/dashboard/analytics" element={
  <PrivateRoute>
    <AnalyticsPage />
  </PrivateRoute>
} />




// Then add the route:
<Route path="/dashboard/integrations" element={
  <PrivateRoute>
    <IntegrationsPage />
  </PrivateRoute>
} />


// Add these routes inside your Protected Routes section:
<Route path="/dashboard/team" element={
  <PrivateRoute>
    <TeamManagementPage />
  </PrivateRoute>
} />

<Route path="/dashboard/billing" element={
  <PrivateRoute>
    <BillingPage />
  </PrivateRoute>
} />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App