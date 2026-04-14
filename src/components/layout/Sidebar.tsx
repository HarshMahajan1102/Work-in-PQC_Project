import { NavLink } from "react-router-dom"
import { Wallet, Shield, CheckSquare, Settings, LayoutDashboard } from "lucide-react"
import { cn } from "../../utils/cn"

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/wallet", label: "Wallet", icon: Wallet },
  { path: "/issuer", label: "Issuer", icon: Shield },
  { path: "/verifier", label: "Verifier", icon: CheckSquare },
  { path: "/centre", label: "Centre", icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-surface/50 backdrop-blur-md hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 shadow-glow-primary">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-white tracking-wide">
            Quantum <span className="text-primary">Rakshak</span>
          </span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-surface/80"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-gray-500 text-center">
          PQC Secured System v1.0
        </div>
      </div>
    </aside>
  )
}
