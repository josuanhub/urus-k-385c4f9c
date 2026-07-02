import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  PackageOpen,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/385c4f9c-e908-4973-a966-044e3512c21e/api";
const UPLOAD_URL = "https://www.urusverify.com/v1/factory/project/385c4f9c-e908-4973-a966-044e3512c21e/upload-data";
const HEADERS = { "x-factory-key": "factory2026" };
const PAGE_SIZE = 20;

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl p-4 shadow-2xl border text-sm animate-slide-in
            ${t.type === "success"
              ? "bg-[#00D4AA]/10 border-[#00D4AA]/30 text-[#00D4AA]"
              : "bg-red-500/10 border-red-500/30 text-red-400"}`}
        >
          {t.type === "success" ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
          <span className="flex-1">{t.msg}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded-md bg-white/5 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({ item, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Eliminar registro</h3>
            <p className="text-white/40 text-xs">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p className="text-white/60 text-sm mb-6">
          ¿Estás seguro de que deseas eliminar este registro?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form Modal ─────────────────────────────────────────────────────────────────
function FormModal({ fields, editData, onClose, onSave, loading }) {
  const [form, setForm] = useState(() => {
    const init = {};
    fields.forEach((f) => { init[f] = editData ? (editData[f] ?? "") : ""; });
    return init;
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    fields.forEach((f) => {
      if (!form[f] && form[f] !== 0) errs[f] = "Campo requerido";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const label = (f) => f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#1A1A2E] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center">
              <Settings size={16} className="text-[#6C63FF]" />
            </div>
            <h2 className="text-white font-semibold text-sm">
              {editData ? "Editar registro" : "Nuevo registro"}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {fields.map((f) => (
              <div key={f}>
                <label className="block text-white/60 text-xs font-medium mb-1.5">{label(f)}</label>
                <input
                  type="text"
                  value={form[f]}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, [f]: e.target.value }));
                    if (errors[f]) setErrors((p) => { const n = { ...p }; delete n[f]; return n; });
                  }}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none transition-all
                    focus:border-[#6C63FF]/60 focus:bg-white/8 focus:ring-1 focus:ring-[#6C63FF]/20
                    ${errors[f] ? "border-red-500/50" : "border-white/10"}`}
                  placeholder={`Ingresa ${label(f).toLowerCase()}...`}
                />
                {errors[f] && <p className="text-red-400 text-xs mt-1">{errors[f]}</p>}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              {loading && <RefreshCw size={14} className="animate-spin" />}
              {editData ? "Guardar cambios" : "Crear registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Configuracion() {
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const [tabla, setTabla] = useState(null);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Discover table name from first available endpoint hint
  // We'll try a known pattern by fetching the API root
  useEffect(() => {
    // Try common config table names
    const candidates = ["configuracion", "config", "configuraciones", "settings", "sistema", "parametros"];
    let found = false;

    const tryTable = async (names, idx) => {
      if (idx >= names.length) {
        // fallback: use first candidate
        setTabla(candidates[0]);
        fetchData(candidates[0]);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/${names[idx]}`, {
          headers: { ...HEADERS, "Content-Type": "application/json" },
        });
        if (res.ok) {
          found = true;
          setTabla(names[idx]);
          fetchData(names[idx]);
        } else {
          tryTable(names, idx + 1);
        }
      } catch {
        tryTable(names, idx + 1);
      }
    };

    tryTable(candidates, 0);
  }, []);

  const fetchData = useCallback(async (t) => {
    const tbl = t || tabla;
    if (!tbl) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${tbl}`, {
        headers: { ...HEADERS, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = Array.isArray(json) ? json : json.data || json.results || json.items || [];
      setRows(data);
      if (data.length > 0) {
        const exclude = ["id", "_id", "createdAt", "updatedAt", "created_at", "updated_at", "__v"];
        setFields(Object.keys(data[0]).filter((k) => !exclude.includes(k)));
      }
    } catch (err) {
      addToast("Error al cargar los datos del sistema", "error");
    } finally {
      setLoading(false);
    }
  }, [tabla, addToast]);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const payload = { tabla, data: form };
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "x-factory-key": "factory2026" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Registro creado exitosamente", "success");
      setShowModal(false);
      fetchData();
    } catch {
      addToast("Error al crear el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const id = editItem.id || editItem._id;
      const res = await fetch(`${API_BASE}/${tabla}/${id}`, {
        method: "PUT",
        headers: { ...HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Registro actualizado exitosamente", "success");
      setEditItem(null);
      fetchData();
    } catch {
      addToast("Error al actualizar el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const id = deleteItem.id || deleteItem._id;
      const res = await fetch(`${API_BASE}/${tabla}/${id}`, {
        method: "DELETE",
        headers: { ...HEADERS, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Registro eliminado exitosamente", "success");
      setDeleteItem(null);
      fetchData();
    } catch {
      addToast("Error al eliminar el registro", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Filter & paginate
  const filtered = rows.filter((r) => {
    if (!search) return true;
    return Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const colCount = fields.length || 4;

  const displayLabel = (f) => f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toasts} remove={removeToast} />

      {/* Confirm Delete */}
      {deleteItem && (
        <ConfirmDialog
          item={deleteItem}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          loading={deleting}
        />
      )}

      {/* Form Modal */}
      {(showModal || editItem) && fields.length > 0 && (
        <FormModal
          fields={fields}
          editData={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={editItem ? handleEdit : handleCreate}
          loading={saving}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6C63FF22, #00D4AA22)", border: "1px solid #6C63FF33" }}>
              <Settings size={20} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Configuración del sistema</h1>
              <p className="text-white/40 text-sm">Sistema k · Gestión de parámetros</p>
            </div>
          </div>
          {tabla && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 font-mono">
                /{tabla}
              </span>
              <span className="text-xs text-white/30">{rows.length} registros totales</span>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Buscar en configuración..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#6C63FF]/50 focus:ring-1 focus:ring-[#6C63FF]/20 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => fetchData()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <button
              onClick={() => { setEditItem(null); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              <Plus size={16} />
              <span>Nuevo</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        {!loading && rows.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total registros", value: rows.length, color: "#6C63FF" },
              { label: "Filtrados", value: filtered.length, color: "#00D4AA" },
              { label: "Página actual", value: `${page}/${totalPages || 1}`, color: "#6C63FF" },
              { label: "Campos", value: fields.length, color: "#00D4AA" },
            ].map((s) => (
              <div key={s.label} className="bg-[#1A1A2E] border border-white/8 rounded-xl p-4">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-[#1A1A2E] border border-white/8 rounded-2xl overflow-hidden">

          {/* Table Header Label */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-white/40" />
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Registros de configuración</span>
            </div>
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="text-xs text-[#6C63FF] hover:text-[#00D4AA] flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Limpiar filtro
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  {loading
                    ? Array.from({ length: colCount }).map((_, i) => (
                        <th key={i} className="px-4 py-3 text-left">
                          <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                        </th>
                      ))
                    : fields.map((f) => (
                        <th key={f} className="px-4 py-3 text-left text-white/40 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          {displayLabel(f)}
                        </th>
                      ))}
                  <th className="px-4 py-3 text-right text-white/40 text-xs font-semibold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                  : paginated.length === 0
                  ? (
                    <tr>
                      <td colSpan={fields.length + 1} className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center">
                            <PackageOpen size={28} className="text-white/20" />
                          </div>
                          <div>
                            <p className="text-white/50 font-medium mb-1">
                              {search ? "Sin resultados" : "Sin registros aún"}
                            </p>
                            <p className="text-white/25 text-xs">
                              {search ? `No se encontraron resultados para "${search}"` : "Comienza agregando tu primer registro"}
                            </p>
                          </div>
                          {!search && (
                            <button
                              onClick={() => { setEditItem(null); setShowModal(true); }}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
                            >
                              <Plus size={15} />
                              Crear primer registro
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                  : paginated.map((row, idx) => {
                    const id = row.id || row._id || idx;
                    return (
                      <tr
                        key={id}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                      >
                        {fields.map((f) => (
                          <td key={f} className="px-4 py-3 text-white/70 whitespace-nowrap max-w-[200px] truncate">
                            {row[f] !== null && row[f] !== undefined ? String(row[f]) : (
                              <span className="text-white/20 italic text-xs">—</span>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditItem(row); setShowModal(false); }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-all"
                              title="Editar"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteItem(row)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/8">
              <p className="text-white/35 text-xs">
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                        ${p === page
                          ? "text-white"
                          : "text-white/40 hover:text-white hover:bg-white/8"}`}
                      style={p === page ? { background: "linear-gradient(135deg, #6C63FF, #00D4AA)" } : {}}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-center text-white/15 text-xs mt-6">
          Sistema k · Módulo Configuración · API {tabla ? `/${tabla}` : "cargando..."}
        </p>
      </div>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
      `}</style>
    </div>
  );
}