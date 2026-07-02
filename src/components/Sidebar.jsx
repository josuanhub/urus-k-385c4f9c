import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";

const navItems = [];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? "4.5rem" : "16rem",
        background: "#0A0A0F",
        borderRight: "1px solid rgba(108,99,255,0.15)",
      }}
    >
      {/* Header / Logo */}
      <div
        className="flex items-center justify-between px-3 py-4"
        style={{ minHeight: "64px", borderBottom: "1px solid rgba(108,99,255,0.1)" }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Logo mark */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-lg font-extrabold text-sm"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
              color: "#0A0A0F",
              letterSpacing: "-0.5px",
            }}
          >
            k
          </div>

          {/* Brand name */}
          <span
            className={`font-bold text-base whitespace-nowrap transition-all duration-300 ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
            style={{ color: "#ffffff" }}
          >
            Sistema{" "}
            <span style={{ color: "#6C63FF" }}>k</span>
          </span>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            width: "28px",
            height: "28px",
            background: "rgba(108,99,255,0.12)",
            border: "1px solid rgba(108,99,255,0.25)",
            color: "#6C63FF",
          }}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? (
            <ChevronRight size={14} strokeWidth={2.5} />
          ) : (
            <ChevronLeft size={14} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1">
        {navItems.length === 0 ? (
          /* Placeholder when no items */
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <LayoutDashboard size={18} strokeWidth={1.5} />
            {!collapsed && (
              <span className="text-xs font-medium truncate">Sin secciones</span>
            )}
          </div>
        ) : (
          navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${
                  collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                }`}
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(108,99,255,0.18) 0%, rgba(0,212,170,0.08) 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(108,99,255,0.3)"
                    : "1px solid transparent",
                  color: isActive ? "#6C63FF" : "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      "rgba(108,99,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  }
                }}
              >
                {/* Active indicator bar */}
                {isActive && !collapsed && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{
                      width: "3px",
                      height: "60%",
                      background:
                        "linear-gradient(180deg, #6C63FF 0%, #00D4AA 100%)",
                    }}
                  />
                )}

                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                />

                {!collapsed && (
                  <span className="text-sm font-medium truncate transition-all duration-200">
                    {item.label}
                  </span>
                )}

                {/* Tooltip for collapsed */}
                {collapsed && (
                  <span
                    className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                    style={{
                      background: "#1A1A2E",
                      color: "#ffffff",
                      border: "1px solid rgba(108,99,255,0.25)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Footer / Company name */}
      <div
        className="px-3 py-4 flex items-center gap-2 overflow-hidden"
        style={{ borderTop: "1px solid rgba(108,99,255,0.1)" }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{
            width: "32px",
            height: "32px",
            background: "rgba(0,212,170,0.1)",
            border: "1px solid rgba(0,212,170,0.2)",
          }}
        >
          <Building2 size={15} strokeWidth={1.8} style={{ color: "#00D4AA" }} />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            collapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          <p
            className="text-xs font-semibold truncate leading-tight"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            k
          </p>
          <p
            className="text-xs truncate leading-tight"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Empresa
          </p>
        </div>
      </div>
    </aside>
  );
}