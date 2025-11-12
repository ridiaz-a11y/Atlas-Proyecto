import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RutinasList from './pages/RutinasList'
import RutinaDetail from './pages/RutinaDetail'
import RutinaForm from './pages/RutinaForm'
import Historial from './pages/Historial'
import EjecutarRutina from './pages/EjecutarRutina'
import Perfil from './pages/Perfil'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      {/* Rutas públicas */}
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <RutinasList />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/nueva"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <RutinaForm />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <RutinaDetail />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/:id/editar"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <RutinaForm />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/:id/ejecutar"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <EjecutarRutina />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <Historial />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Layout>
              <PageTransition>
                <Perfil />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        }
      />
      </Routes>
    </AnimatePresence>
  )
}

export default App
