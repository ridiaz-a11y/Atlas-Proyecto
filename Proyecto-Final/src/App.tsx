import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import RutinasList from './pages/RutinasList'
import RutinaDetail from './pages/RutinaDetail'
import RutinaForm from './pages/RutinaForm'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rutinas" element={<RutinasList />} />
        <Route path="/rutinas/nueva" element={<RutinaForm />} />
        <Route path="/rutinas/:id" element={<RutinaDetail />} />
        <Route path="/rutinas/:id/editar" element={<RutinaForm />} />
      </Routes>
    </Layout>
  )
}

export default App
