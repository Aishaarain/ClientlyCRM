import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FolderKanban, FileText,
  MessageSquare, Sparkles, ShieldAlert, Settings,
  UserPlus, CheckSquare, FileSearch, Mail,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { user, isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
      isActive
        ? "bg-primary text-white shadow-card"
        : "text-muted hover:bg-white hover:text-primary"
    }`;

  const links = [
    { to: "/dashboard",   label: "Dashboard",    icon: LayoutDashboard, show: true },
    { to: "/clients",     label: "Clients",       icon: Users,           show: isAdmin },
    { to: "/projects",    label: isAdmin ? "Projects" : "My Projects", icon: FolderKanban, show: true },
    { to: "/tasks",       label: "Tasks",         icon: CheckSquare,     show: isAdmin },
    { to: "/invoices",    label: "Invoices",      icon: FileText,        show: isAdmin },
    { to: "/interactions",label: "Interactions",  icon: MessageSquare,   show: isAdmin },
    { to: "/ai/proposal", label: "AI Proposal",   icon: Sparkles,        show: isAdmin },
    { to: "/ai/follow-up",label: "AI Follow-up",  icon: Mail,            show: isAdmin },
    { to: "/ai/content",  label: "AI Content",    icon: FileSearch,      show: isAdmin },
    { to: "/risk",        label: "Risk Center",   icon: ShieldAlert,     show: isAdmin },
    { to: "/team",        label: "Team",          icon: UserPlus,        show: isAdmin },
    { to: "/settings",    label: "Settings",      icon: Settings,        show: true },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen
          flex flex-col
          border-r border-white/70 bg-white/85 shadow-card backdrop-blur-xl
          p-4 transition-all duration-300
          ${collapsed ? "lg:w-24" : "lg:w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo — fixed at top, never scrolls */}
        <div className="mb-6 flex shrink-0 items-center gap-3 px-2">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-black text-white">
            C
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-black text-ink">Cliently CRM</h1>
              <p className="text-xs font-bold text-muted">{user?.role || "user"}</p>
            </div>
          )}
        </div>

        {/* Nav — scrollable, takes remaining height */}
        <nav className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
          {links
            .filter((link) => link.show)
            .map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  onClick={onCloseMobile}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{link.label}</span>}
                </NavLink>
              );
            })}
        </nav>
      </aside>
    </>
  );
}