import { Menu, Bell, User } from "lucide-react"

export function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-surface/30 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center md:hidden">
        {/* Mobile menu button */}
        <button className="p-2 -ml-2 text-gray-400 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
          <Menu className="h-6 w-6" />
        </button>
        <span className="ml-2 font-bold text-lg text-white">
          Quantum <span className="text-primary">Rakshak</span>
        </span>
      </div>

      <div className="hidden md:block">
        <h2 className="text-sm text-gray-400 font-medium">Network Status: <span className="text-green-400">Secure</span></h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary shadow-glow-secondary"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary cursor-pointer hover:shadow-glow-primary transition-all">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  )
}
