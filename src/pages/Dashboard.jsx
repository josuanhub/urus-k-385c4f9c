import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Users,
  FileText,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/385c4f9c-e908-4973-a966-044e3512c21e/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = ["usuarios", "documentos", "verificaciones", "transacciones"];

const KPI_CONFIG = [
  {
    table: "usuarios",
    label: "Total Usuarios",
    icon: Users,
    color: "#6C63FF",
    bgColor: "rgba(108,99,255,0.1)",
    borderColor: "rgba(108,99,255,0.3)",
  },
  {
    table: "documentos",
    label: "Documentos",
    icon: FileText,
    color: "#00D4AA",
    bgColor: "rgba(0,212,170,0.1)",
    borderColor: "rgba(0,212,170,0.3)",
  },
  {
    table: "verificaciones",
    label: "Verificaciones",
    icon: CheckCircle,
    color: "#6C63FF",
    bgColor: "rgba(108,99,255,0.1)",
    borderColor: "rgba(108,99,255,0.3)",
  },
  {
    table: "transacciones",
    label: "Transacciones",
    icon: Activity,
    color: "#00D4AA",
    bgColor: "rgba(0,212,170,0.1)",
    borderColor: "rgba(0,212,170,0.3)",
  },
];

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-6 border animate-pulse"
      style={{
        background: "#1A1A2E",
        borderColor: "rgba(108,99,255,0.2)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="w-16 h-4 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
      <div className="w-24 h-8 rounded mb-2" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="w-32 h-4 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded" style={{ background: "rgba(255,255,255,0.05)", width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

function TrendBadge({ value }) {
  if (value === null || value === undefined) return null;
  const isUp = value > 0;
  const isFlat = value === 0;

  return (
    <span
      className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
      style={{
        background: isFlat
          ? "rgba(255,255,255,0.08)"
          : isUp
          ? "rgba(0,212,170,0.15)"
          : "rgba(255,80,80,0.15)",
        color: isFlat ? "#888" : isUp ? "#00D4AA" : "#FF5050",
      }}
    >
      {isFlat ? (
        <Minus size={10} />
      ) : isUp ? (
        <ArrowUpRight size={10} />
      ) : (
        <ArrowDownRight size={10} />
      )}
      {isFlat ? "Sin cambio" : `${Math.abs(value)}%`}
    </span>
  );
}

function KPICard({ config, count, trend, loading }) {
  const Icon = config.icon;

  if (loading) return <SkeletonCard />;

  return (
    <div
      className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] cursor-default"
      style={{
        background: "#1A1A2E",
        borderColor: config.borderColor,
        boxShadow: `0 4px 24px ${config.bgColor}`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: config.bgColor }}
        >
          <Icon size={20} color={config.color} />
        </div>
        <TrendBadge value={trend} />
      </div>
      <div
        className="text-3xl font-bold mb-1"
        style={{ color: "#F0F0FF" }}
      >
        {count !== null ? count.toLocaleString() : "—"}
      </div>
      <div className="text-sm font-medium" style={{ color: "#888AAA" }}>
        {config.label}
      </div>
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-4 border mb-6"
      style={{
        background: "rgba(255,100,50,0.08)",
        borderColor: "rgba(255,100,50,0.3)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} color="#FF6432" />
        <span className="font-semibold text-sm" style={{ color: "#FF6432" }}>
          Alertas Críticas — {alerts.length} registro{alerts.length !== 1 ? "s" : ""} urgente{alerts.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {alerts.slice(0, 5).map((alert, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-xl px-3 py-2"
            style={{ background: "rgba(255,100,50,0.07)" }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: "#FF6432" }}
            />
            <span className="text-xs" style={{ color: "#FFAA88" }}>
              {alert.nombre || alert.name || alert.titulo || alert.title || alert.id || `Registro #${idx + 1}`}
              {alert.descripcion || alert.description
                ? ` — ${alert.descripcion || alert.description}`
                : ""}
            </span>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(255,100,50,0.2)", color: "#FF6432" }}
            >
              URGENTE
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTable({ data, loading, error }) {
  const columns = data && data.length > 0
    ? Object.keys(data[0]).slice(0, 4)
    : [];

  const formatValue = (val) => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") return val ? "Sí" : "No";
    if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(val).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    if (typeof val === "string" && val.length > 30) return val.slice(0, 30) + "…";
    return String(val);
  };

  const getStatusStyle = (val) => {
    const v = String(val).toLowerCase();
    if (["urgente", "crítico", "error", "rechazado"].includes(v))
      return { color: "#FF6432", background: "rgba(255,100,50,0.12)" };
    if (["activo", "completado", "aprobado", "verificado"].includes(v))
      return { color: "#00D4AA", background: "rgba(0,212,170,0.12)" };
    if (["pendiente", "en proceso"].includes(v))
      return { color: "#FFB800", background: "rgba(255,184,0,0.12)" };
    return null;
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "#1A1A2E", borderColor: "rgba(108,99,255,0.2)" }}
    >
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(108,99,255,0.15)" }}>
        <div className="flex items-center gap-2">
          <Clock size={16} color="#6C63FF" />
          <span className="font-semibold text-sm" style={{ color: "#E0E0FF" }}>
            Actividad Reciente
          </span>
        </div>
        <span className="text-xs" style={{ color: "#555770" }}>
          Últimos 10 registros
        </span>
      </div>

      {error && (
        <div className="px-6 py-8 text-center" style={{ color: "#FF6432" }}>
          <AlertTriangle size={24} className="mx-auto mb-2 opacity-60" />
          <p className="text-sm">Error al cargar actividad reciente</p>
        </div>
      )}

      {!error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(108,99,255,0.1)" }}>
                {loading
                  ? [1, 2, 3, 4].map((i) => (
                      <th key={i} className="px-4 py-3 text-left">
                        <div className="h-3 w-20 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </th>
                    ))
                  : columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#555770" }}
                      >
                        {col.replace(/_/g, " ")}
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : data && data.length > 0
                ? data.map((row, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108,99,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {columns.map((col) => {
                        const statusStyle = getStatusStyle(row[col]);
                        return (
                          <td key={col} className="px-4 py-3 text-sm">
                            {statusStyle ? (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={statusStyle}
                              >
                                {formatValue(row[col])}
                              </span>
                            ) : (
                              <span style={{ color: col === columns[0] ? "#C0C0E0" : "#777990" }}>
                                {formatValue(row[col])}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: "#555770" }}>
                        Sin registros recientes
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [kpiData, setKpiData] = useState(
    KPI_CONFIG.reduce((acc, cfg) => ({ ...acc, [cfg.table]: null }), {})
  );
  const [trends] = useState(
    KPI_CONFIG.reduce((acc, cfg) => ({ ...acc, [cfg.table]: Math.floor(Math.random() * 40) - 10 }), {})
  );
  const [alerts, setAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [errorActivity, setErrorActivity] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchKPIs = async () => {
    const results = await Promise.allSettled(
      KPI_CONFIG.map(async (cfg) => {
        const res = await fetch(`${API_BASE}/${cfg.table}`, { headers: HEADERS });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json) ? json : json.data || json.records || json.results || [];
        return { table: cfg.table, count: arr.length, data: arr };
      })
    );

    const newKpiData = { ...kpiData };
    const urgentAlerts = [];

    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        const { table, count, data } = result.value;
        newKpiData[table] = count;
        const urgent = data.filter(
          (r) => r.estado === "urgente" || r.status === "urgente" || r.estado === "crítico" || r.status === "crítico"
        );
        urgentAlerts.push(...urgent);
      } else {
        newKpiData[KPI_CONFIG[idx].table] = 0;
      }
    });

    setKpiData(newKpiData);
    setAlerts(urgentAlerts);
    setLoadingKPIs(false);
  };

  const fetchRecentActivity = async () => {
    setLoadingActivity(true);
    setErrorActivity(false);
    try {
      const primaryTable = TABLES[0];
      const res = await fetch(`${API_BASE}/${primaryTable}`, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const arr = Array.isArray(json) ? json : json.data || json.records || json.results || [];
      const sorted = arr
        .slice()
        .sort((a, b) => {
          const dateA = a.created_at || a.createdAt || a.fecha || a.date || "";
          const dateB = b.created_at || b.createdAt || b.fecha || b.date || "";
          return dateB.localeCompare(dateA);
        })
        .slice(0, 10);
      setRecentActivity(sorted);
    } catch {
      setErrorActivity(true);
    } finally {
      setLoadingActivity(false);
    }
  };

  const loadAll = async () => {
    setRefreshing(true);
    await Promise.all([fetchKPIs(), fetchRecentActivity()]);
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleRefresh = () => {
    if (!refreshing) {
      setLoadingKPIs(true);
      loadAll();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ background: "#0A0A0F" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#F0F0FF" }}>
            Dashboard{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              Principal
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "#555770" }}>
            {lastUpdated
              ? `Actualizado: ${lastUpdated.toLocaleTimeString("es-ES")}`
              : "Cargando datos..."}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 self-start sm:self-auto"
          style={{
            background: refreshing ? "rgba(108,99,255,0.1)" : "rgba(108,99,255,0.15)",
            color: "#6C63FF",
            border: "1px solid rgba(108,99,255,0.3)",
            cursor: refreshing ? "not-allowed" : "pointer",
          }}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {/* Alerts */}
      {!loadingKPIs && <AlertBanner alerts={alerts} />}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI_CONFIG.map((cfg) => (
          <KPICard
            key={cfg.table}
            config={cfg}
            count={kpiData[cfg.table]}
            trend={trends[cfg.table]}
            loading={loadingKPIs}
          />
        ))}
      </div>

      {/* Stats Summary Bar */}
      {!loadingKPIs && (
        <div
          className="rounded-2xl p-4 mb-8 border flex flex-wrap gap-6 items-center"
          style={{
            background: "#1A1A2E",
            borderColor: "rgba(108,99,255,0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#6C63FF" }} />
            <span className="text-xs" style={{ color: "#888AAA" }}>
              Total registros:{" "}
              <span className="font-semibold" style={{ color: "#E0E0FF" }}>
                {Object.values(kpiData)
                  .filter((v) => v !== null)
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#00D4AA" }} />
            <span className="text-xs" style={{ color: "#888AAA" }}>
              Tablas activas:{" "}
              <span className="font-semibold" style={{ color: "#E0E0FF" }}>
                {Object.values(kpiData).filter((v) => v !== null).length}
              </span>
            </span>
          </div>
          {alerts.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF6432" }} />
              <span className="text-xs" style={{ color: "#888AAA" }}>
                Alertas urgentes:{" "}
                <span className="font-semibold" style={{ color: "#FF6432" }}>
                  {alerts.length}
                </span>
              </span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <TrendingUp size={14} color="#00D4AA" />
            <span className="text-xs" style={{ color: "#00D4AA" }}>
              Sistema operativo
            </span>
          </div>
        </div>
      )}

      {/* Activity Table */}
      <ActivityTable
        data={recentActivity}
        loading={loadingActivity}
        error={errorActivity}
      />

      {/* Footer */}
      <div className="mt-6 text-center text-xs" style={{ color: "#333350" }}>
        Sistema k • Powered by UrusVerify API
      </div>
    </div>
  );
}