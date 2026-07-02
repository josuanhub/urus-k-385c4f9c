import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, Settings, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import ImportarDatos from "./pages/ImportarDatos";
import Configuracion from "./pages/Configuracion";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/importar", label: "Importar Datos", icon: Upload },
  { path: "/configuracion", label: "Configuración", icon: Settings },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
          <span className="text-white font-black text-sm">K</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">Sistema k</p>
            <p className="text-xs leading-tight" style={{ color: "#6C63FF" }}>para k</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path || (location.pathname === "/" && path === "/dashboard");
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group
                ${active
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              style={active ? {
                background: "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))",
                boxShadow: "inset 0 0 0 1px rgba(108,99,255,0.4)"
              } : {}}
              title={collapsed ? label : undefined}
            >
              <Icon
                size={18}
                className="flex-shrink-0"
                style={active ? { color: "#6C63FF" } : {}}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#00D4AA" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle desktop */}
      <div className="hidden md:flex px-2 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-200 text-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Colapsar</span></>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen flex-shrink-0 transition-all duration-300 border-r border-white/10`}
        style={{
          width: collapsed ? "72px" : "220px",
          background: "#1A1A2E",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col md:hidden transition-transform duration-300 border-r border-white/10
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: "220px", background: "#1A1A2E" }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
              <span className="text-white font-black text-xs">K</span>
            </div>
            <span className="text-white font-bold text-sm">Sistema k</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}

function TopBar({ setMobileOpen }) {
  const location = useLocation();
  const current = NAV_ITEMS.find(
    (n) => location.pathname === n.path || (location.pathname === "/" && n.path === "/dashboard")
  );

  return (
    <header className="flex items-center gap-4 px-4 md:px-6 py-4 border-b border-white/10 flex-shrink-0"
      style={{ background: "#0A0A0F" }}>
      <button
        className="md:hidden text-gray-400 hover:text-white transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>
      <div>
        <h1 className="text-white font-semibold text-base md:text-lg leading-tight">
          {current?.label || "Dashboard"}
        </h1>
        <p className="text-xs text-gray-500 leading-tight">Sistema k · para k</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00D4AA" }} />
        <span className="text-xs text-gray-400 hidden sm:inline">Conectado</span>
      </div>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0A0A0F" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto" style={{ background: "#0A0A0F" }}>
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/importar" element={<ImportarDatos />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}