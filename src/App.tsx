import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Visione from './components/Visione'
import Missione from './components/Missione'
import Services from './components/Services'
import Footer from './components/Footer'
import ServiceDetail from './components/ServiceDetail'
import About from './components/About'

const BASE_URL = import.meta.env.BASE_URL

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Visione />
      <Missione />
      <Services />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename={BASE_URL}>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<><Header /><About /><Footer /></>} />
          <Route path="/servizi/:serviceId" element={<ServiceDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
