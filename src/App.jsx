import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import SmoothScroll   from './components/ui/SmoothScroll'
import LoadingScreen  from './components/ui/LoadingScreen'
import CustomCursor   from './components/ui/CustomCursor'
import CookieBanner   from './components/ui/CookieBanner'

// Route-level code-splitting: each page (and its heavy deps like three.js /
// recharts) loads only when the route is first visited, shrinking initial load.
const Landing           = lazy(() => import('./pages/Landing'))
const Login             = lazy(() => import('./pages/Login'))
const Signup            = lazy(() => import('./pages/Signup'))
const GoogleAuthSuccess = lazy(() => import('./pages/GoogleAuthSuccess'))
const About             = lazy(() => import('./pages/About'))
const Privacy           = lazy(() => import('./pages/Privacy'))
const Terms             = lazy(() => import('./pages/Terms'))
const Cookies           = lazy(() => import('./pages/Cookies'))
const Contact           = lazy(() => import('./pages/Contact'))
const HelpCenter        = lazy(() => import('./pages/HelpCenter'))
const Blog              = lazy(() => import('./pages/Blog'))
const BlogPost          = lazy(() => import('./pages/BlogPost'))

const Dashboard     = lazy(() => import('./pages/dashboard/Dashboard'))
const DashboardHome = lazy(() => import('./pages/dashboard/Dashboard').then(m => ({ default: m.DashboardHome })))
const Proposal      = lazy(() => import('./pages/dashboard/Proposal'))
const Messages      = lazy(() => import('./pages/dashboard/Messages'))
const Gig           = lazy(() => import('./pages/dashboard/Gig'))
const Chatbot       = lazy(() => import('./pages/dashboard/Chatbot'))
const Pricing       = lazy(() => import('./pages/dashboard/Pricing'))
const History       = lazy(() => import('./pages/dashboard/History'))
const Analytics     = lazy(() => import('./pages/dashboard/Analytics'))
const Profile       = lazy(() => import('./pages/dashboard/Profile'))

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

// Fallback shown while a lazily-loaded route chunk is downloading
function RouteFallback() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0284C7', borderTopColor: 'transparent' }} />
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
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
