import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

// ─── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

// ─── Hook ───────────────────────────────────────────────────────────────────

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

// ─── Config per type ────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    border: "border-[#00D4AA]",
    iconColor: "text-[#00D4AA]",
    bar: "bg-[#00D4AA]",
    label: "Éxito",
  },
  error: {
    icon: XCircle,
    border: "border-red-500",
    iconColor: "text-red-400",
    bar: "bg-red-500",
    label: "Error",
  },
  warning: {
    icon: AlertCircle,
    border: "border-yellow-400",
    iconColor: "text-yellow-400",
    bar: "bg-yellow-400",
    label: "Aviso",
  },
  info: {
    icon: Info,
    border: "border-[#6C63FF]",
    iconColor: "text-[#6C63FF]",
    bar: "bg-[#6C63FF]",
    label: "Info",
  },
};

const DURATION = 4000;
const MAX_TOASTS = 3;

// ─── Single Toast Item ───────────────────────────────────────────────────────

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingRef = useRef(DURATION);
  const pausedRef = useRef(false);

  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    clearInterval(intervalRef.current);
    setTimeout(() => onRemove(toast.id), 350);
  }, [leaving, onRemove, toast.id]);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Progress bar & auto-dismiss
  const startProgress = useCallback(() => {
    clearInterval(intervalRef.current);
    startTimeRef.current = Date.now();
    const tick = 50;

    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;
      remainingRef.current -= tick;
      const pct = Math.max(0, (remainingRef.current / DURATION) * 100);
      setProgress(pct);
      if (remainingRef.current <= 0) {
        clearInterval(intervalRef.current);
        dismiss();
      }
    }, tick);
  }, [dismiss]);

  useEffect(() => {
    startProgress();
    return () => clearInterval(intervalRef.current);
  }, [startProgress]);

  const handleMouseEnter = () => {
    pausedRef.current = true;
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "all 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        transform: visible && !leaving
          ? "translateX(0) scale(1)"
          : "translateX(110%) scale(0.95)",
        opacity: visible && !leaving ? 1 : 0,
      }}
      className={`
        relative w-full max-w-sm overflow-hidden
        rounded-xl border ${config.border}
        bg-[#1A1A2E] shadow-2xl shadow-black/60
        backdrop-blur-sm
      `}
    >
      {/* Body */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <Icon
          size={20}
          className={`${config.iconColor} mt-0.5 flex-shrink-0`}
          strokeWidth={2}
        />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-widest ${config.iconColor} mb-0.5`}>
            {toast.title || config.label}
          </p>
          {toast.message && (
            <p className="text-sm text-gray-300 leading-snug break-words">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-white/5">
        <div
          className={`h-full ${config.bar} transition-all`}
          style={{
            width: `${progress}%`,
            transition: "width 50ms linear",
          }}
        />
      </div>
    </div>
  );
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = "info", title, message }) => {
    setToasts((prev) => {
      const next = [
        ...prev,
        {
          id: `toast-${++counterRef.current}-${Date.now()}`,
          type,
          title,
          message,
        },
      ];
      // Keep max 3, remove oldest
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
    });
  }, []);

  const success = useCallback(
    (message, title) => addToast({ type: "success", title, message }),
    [addToast]
  );
  const error = useCallback(
    (message, title) => addToast({ type: "error", title, message }),
    [addToast]
  );
  const warning = useCallback(
    (message, title) => addToast({ type: "warning", title, message }),
    [addToast]
  );
  const info = useCallback(
    (message, title) => addToast({ type: "info", title, message }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ success, error, warning, info, addToast }}>
      {children}

      {/* Portal-like fixed container — bottom-right */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="
          fixed bottom-4 right-4 z-[9999]
          flex flex-col-reverse gap-2
          w-[calc(100vw-2rem)] sm:w-80
          pointer-events-none
        "
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;