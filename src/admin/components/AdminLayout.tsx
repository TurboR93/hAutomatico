import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* Sidebar fissa su desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 shadow-lg md:block">
        <Sidebar />
      </aside>

      {/* Top bar mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#FDF07A] px-4 py-3 shadow md:hidden">
        <div className="flex items-center gap-2">
          <img src="/logohAutomatico-red.png" alt="hAutomatico" className="h-8 w-auto object-contain" />
          <span className="font-black tracking-tight text-black">Amministrazione</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-black" aria-label="Apri menu">
          <Menu size={24} />
        </button>
      </header>

      {/* Drawer mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl md:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 text-black"
                aria-label="Chiudi menu"
              >
                <X size={22} />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Contenuto */}
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
