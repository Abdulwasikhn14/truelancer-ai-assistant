import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import SmoothScroll   from './components/ui/SmoothScroll'
import LoadingScreen  from './components/ui/LoadingScreen'
import CustomCursor   from './components/ui/CustomCursor'
import CookieBanner   from './components/ui/CookieBanner'

import Landing           from './pages/Landing'
import Login             from './pages/Login'
import Signup            from './pages/Signup'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import About             from './pages/About'
import Privacy           from './pages/Privacy'
import Terms             from './pages/Terms'
import Cookies           from './pages/Cookies'
import Contact           from './pages/Contact'
import HelpCenter        from './pages/HelpCenter'
import Blog              from './pages/Blog'
import BlogPost          from './pages/BlogPost'

import Dashboard, { DashboardHome } from './pages/dashboard/Dashboard'
import Proposal  from './pages/dashboard/Proposal'
import Messages  from './pages/dashboard/Messages'
import Gig       from './pages/dashboard/Gig'
import Chatbot   from './pages/dashboard/Chatbot'
import Pricing   from './pages/dashboard/Pricing'
import History   from './pages/dashboard/History'
import Analytics from './pages/dashboard/Analytics'
import Profile   from './pages/dashboard/Profile'

// ── Page transition wrapper ───────────────────────────────────────────────────

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
)

// ── ProtectedRoute ────────────────────────────────────────────────────────────

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0284C7', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

// ── Routes ────────────────────────────────────────────────────────────────────

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/"                    element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login"               element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup"              element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/auth/google/success" element={<PageWrapper><GoogleAuthSuccess /></PageWrapper>} />
        <Route path="/about"               element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/privacy"             element={<PageWrapper><Privacy /></PageWrapper>} />
        <Route path="/terms"               element={<PageWrapper><Terms /></PageWrapper>} />
        <Route path="/cookies"             element={<PageWrapper><Cookies /></PageWrapper>} />
        <Route path="/contact"             element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/help"                element={<PageWrapper><HelpCenter /></PageWrapper>} />
        <Route path="/blog"                element={<PageWrapper><Blog /></PageWrapper>} />
        <Route path="/blog/:id"            element={<PageWrapper><BlogPost /></PageWrapper>} />

        {/* Protected — nested under Dashboard layout (renders <Outlet />) */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        >
          <Route index                  element={<DashboardHome />} />
          <Route path="proposals"       element={<Proposal />}     />
          <Route path="messages"        element={<Messages />}     />
          <Route path="gigs"            element={<Gig />}          />
          <Route path="chatbot"         element={<Chatbot />}      />
          <Route path="pricing"         element={<Pricing />}      />
          <Route path="history"         element={<History />}      />
          <Route path="analytics"       element={<Analytics />}    />
          <Route path="profile"         element={<Profile />}      />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <CustomCursor />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <CookieBanner />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background:   '#ffffff',
                color:        '#0A0A0A',
                border:       '1px solid #E5E7EB',
                borderRadius: '10px',
                fontSize:     '13px',
                fontFamily:   'Inter, Manrope, sans-serif',
                boxShadow:    '0 4px 20px rgba(0,0,0,0.08)',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </SmoothScroll>
  )
}
