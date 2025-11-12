import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
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
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas"
        element={
          <ProtectedRoute>
            <Layout>
              <RutinasList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/nueva"
        element={
          <ProtectedRoute>
            <Layout>
              <RutinaForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <RutinaDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/:id/editar"
        element={
          <ProtectedRoute>
            <Layout>
              <RutinaForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rutinas/:id/ejecutar"
        element={
          <ProtectedRoute>
            <Layout>
              <EjecutarRutina />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <Layout>
              <Historial />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Layout>
              <Perfil />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
