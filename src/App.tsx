import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Visione from './components/Visione'
import Missione from './components/Missione'
import Services from './components/Services'
import Footer from './components/Footer'
import ServiceDetail from './components/ServiceDetail'
import ServicesPage from './components/ServicesPage'
import About from './components/About'
import { CursorFollower } from './components/motion'
import { useSeo } from './hooks/useSeo'

const BASE_URL = import.meta.env.BASE_URL

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function HomePage() {
  useSeo({
    title: 'hAutomatico — Software gestionali e automazione aziendale',
    description:
      'Sviluppiamo software gestionali e soluzioni di automazione e AI su misura per le PMI: gestione turni, e-commerce, noleggio, ristorazione, sicurezza cantiere e siti web.',
    path: '/',
  })
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
      <ScrollToTop />
      <CursorFollower />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<><Header /><About /><Footer /></>} />
          <Route path="/servizi" element={<ServicesPage />} />
          <Route path="/servizi/:serviceId" element={<ServiceDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
