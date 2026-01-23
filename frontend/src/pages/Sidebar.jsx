import {
  LayoutDashboard,
  Plus,
  Users,
  History,
  Settings,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";

export function Sidebar({
  currentPage,
  onNavigate,
  onLogout,
  isMobileOpen,
  onMobileClose,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { id: "create", label: "Create Plan", icon: Plus },
    { id: "clients", label: "Clients", icon: Users },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div className="sticky top-0 h-screen z-50">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col shadow-lg lg:shadow-sm
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:flex h-screen
      `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Logo */}
        <div
          className="p-6 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => handleNavClick("dashboard")}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 transition-transform hover:scale-105">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI Nutritionist
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Coach Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400"
                }`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* User Info & Theme Toggle */}
        <div className="absolute bottom-0 p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-700 dark:to-emerald-900/20 hover:shadow-md transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold shadow-md">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                John Doe
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Pro Coach
              </div>
            </div>
          </div>
          {onLogout && (
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              onClick={() => {
                onLogout();
                if (onMobileClose) {
                  onMobileClose();
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-sm">Logout</span>
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}