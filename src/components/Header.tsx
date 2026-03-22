import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface NavLink {
  label: string
  href: string
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      // Show navbar only after scrolling past the logo intro (~15% of viewport height)
      setIsVisible(window.scrollY > window.innerHeight * 0.15 || location.pathname !== '/')
    }
    // Show immediately on non-homepage routes
    setIsVisible(location.pathname !== '/')
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  // Scroll to section when navigating with hash
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  const navLinks: NavLink[] = [
    { label: 'HOME', href: '/' },
    { label: 'SERVIZI', href: '/#servizi' },
    { label: 'PREPARATI', href: '/#preparati' },
    { label: 'CHI SIAMO', href: '/about' },
  ]

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)

    // If we're already on the homepage and clicking a hash link
    if (location.pathname === '/' && href.startsWith('/#')) {
      const element = document.querySelector(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#FDF07A]/90 backdrop-blur-md shadow-lg'
        : 'bg-[#FDF07A]'
        }`}
    >
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logohAutomatico-red.png"
              alt="hAutomatico Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.div key={link.label} whileHover={{ scale: 1.05 }}>
                <Link
                  to={link.href}
                  className="relative text-black font-bold uppercase text-sm"
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D03F29]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-black font-bold uppercase text-sm hover:text-[#D03F29] transition-colors"
                    onClick={() => handleNavClick(link.href)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header
