import { NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  FileSignature,
  FileText,
  LayoutDashboard,
  LogOut,
  Receipt,
} from 'lucide-react'
import { api } from '../api'

interface SidebarProps {
  onNavigate?: () => void
}

const links = [
  { to: '/', label: 'Panoramica', icon: LayoutDashboard, end: true },
  { to: '/movimenti', label: 'Movimenti', icon: ArrowLeftRight, end: false },
  { to: '/fatture', label: 'Fatture', icon: FileText, end: false },
  { to: '/preventivi', label: 'Preventivi', icon: FileSignature, end: false },
  { to: '/ritenute', label: "Ritenute d'acconto", icon: Receipt, end: false },
]

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.logout()
    } finally {
      onNavigate?.()
      navigate('/login')
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#FDF07A]">
      <div className="flex items-center gap-3 px-6 py-5">
        <img src="/logohAutomatico-red.png" alt="hAutomatico" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="font-black tracking-tight text-black">hAUTOMATICO</div>
          <div className="text-xs font-bold uppercase text-[#D03F29]">Amministrazione</div>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                isActive ? 'bg-[#D03F29] text-white' : 'text-black hover:bg-black/10'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-black/10"
        >
          <LogOut size={20} />
          Esci
        </button>
      </div>
    </div>
  )
}

export default Sidebar
