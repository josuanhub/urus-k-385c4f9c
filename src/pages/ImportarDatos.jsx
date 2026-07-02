import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Image,
  File,
  CheckCircle,
  XCircle,
  Trash2,
  CloudUpload,
  Table,
  AlertCircle,
  Loader2,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/385c4f9c-e908-4973-a966-044e3512c21e/upload-data";

const ACCEPTED_TYPES = [
  ".xlsx",
  ".xls",
  ".csv",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
];

const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
];

function getFileIcon(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    return <FileSpreadsheet className="w-8 h-8" style={{ color: "#00D4AA" }} />;
  }
  if (name.endsWith(".pdf")) {
    return <FileText className="w-8 h-8" style={{ color: "#6C63FF" }} />;
  }
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return <Image className="w-8 h-8" style={{ color: "#00D4AA" }} />;
  }
  return <File className="w-8 h-8" style={{ color: "#6C63FF" }} />;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function isValidFile(file) {
  return ACCEPTED_MIME.includes(file.type) || ACCEPTED_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle"); // idle | dragging | uploading | success | error
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const resetState = () => {
    setStatus("idle");
    setSelectedFile(null);
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    setValidationError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!isValidFile(file)) {
      setValidationError(
        `Tipo de archivo no permitido. Acepta: ${ACCEPTED_TYPES.join(", ")}`
      );
      return;
    }
    setValidationError("");
    setSelectedFile(file);
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) setStatus("dragging");
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) setStatus("idle");
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setStatus("idle");
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus("uploading");
    setProgress(0);
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              setResult(data);
              setStatus("success");
            } catch {
              setResult({ raw: xhr.responseText });
              setStatus("success");
            }
            resolve();
          } else {
            let msg = `Error ${xhr.status}`;
            try {
              const err = JSON.parse(xhr.responseText);
              msg = err.message || err.error || msg;
            } catch {}
            reject(new Error(msg));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Error de red al subir el archivo.")));
        xhr.addEventListener("abort", () => reject(new Error("Carga cancelada.")));

        xhr.open("POST", UPLOAD_URL);
        xhr.setRequestHeader("x-factory-key", "factory2026");
        xhr.send(formData);
      });
    } catch (err) {
      setErrorMsg(err.message || "Error desconocido");
      setStatus("error");
      setProgress(0);
    }
  };

  const isDragging = status === "dragging";
  const isUploading = status === "uploading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div
      className="min-h-screen w-full px-4 py-8 md:px-8 lg:px-12"
      style={{ background: "#0A0A0F" }}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-2 rounded-lg"
            style={{ background: "rgba(108,99,255,0.15)" }}
          >
            <CloudUpload className="w-6 h-6" style={{ color: "#6C63FF" }} />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: "#F0F0FF" }}
          >
            Importar Datos
          </h1>
        </div>
        <p className="text-sm md:text-base" style={{ color: "#6B7280" }}>
          Sube archivos .xlsx, .xls, .csv, .pdf, .png, .jpg para importar datos
          al sistema k.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none"
          style={{
            borderColor: isDragging
              ? "#6C63FF"
              : selectedFile
              ? "#00D4AA"
              : "#2A2A4A",
            background: isDragging
              ? "rgba(108,99,255,0.08)"
              : selectedFile
              ? "rgba(0,212,170,0.04)"
              : "rgba(26,26,46,0.6)",
            boxShadow: isDragging
              ? "0 0 0 4px rgba(108,99,255,0.15)"
              : selectedFile
              ? "0 0 0 2px rgba(0,212,170,0.1)"
              : "none",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleInputChange}
            disabled={isUploading}
          />

          <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
            <div
              className="p-4 rounded-full transition-all duration-300"
              style={{
                background: isDragging
                  ? "rgba(108,99,255,0.2)"
                  : "rgba(26,26,46,0.8)",
              }}
            >
              <Upload
                className="w-10 h-10 transition-all duration-300"
                style={{
                  color: isDragging
                    ? "#6C63FF"
                    : selectedFile
                    ? "#00D4AA"
                    : "#4B5563",
                }}
              />
            </div>

            {isDragging ? (
              <p
                className="text-lg font-semibold"
                style={{ color: "#6C63FF" }}
              >
                Suelta el archivo aquí
              </p>
            ) : (
              <>
                <div>
                  <p
                    className="text-base font-semibold mb-1"
                    style={{ color: "#D1D5DB" }}
                  >
                    Arrastra y suelta tu archivo aquí
                  </p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    o{" "}
                    <span
                      className="font-medium underline underline-offset-2"
                      style={{ color: "#6C63FF" }}
                    >
                      haz clic para seleccionar
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {ACCEPTED_TYPES.map((ext) => (
                    <span
                      key={ext}
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "rgba(108,99,255,0.1)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(108,99,255,0.2)",
                      }}
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: "#EF4444" }} />
            <p className="text-sm" style={{ color: "#FCA5A5" }}>
              {validationError}
            </p>
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && (
          <div
            className="rounded-2xl p-4 md:p-5"
            style={{
              background: "rgba(26,26,46,0.8)",
              border: "1px solid rgba(0,212,170,0.15)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl shrink-0"
                style={{ background: "rgba(0,212,170,0.08)" }}
              >
                {getFileIcon(selectedFile)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm md:text-base truncate"
                  style={{ color: "#F0F0FF" }}
                >
                  {selectedFile.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetState();
                  }}
                  className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                  title="Quitar archivo"
                >
                  <Trash2 className="w-5 h-5" style={{ color: "#6B7280" }} />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {(isUploading || progress > 0) && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>
                    {isUploading ? "Subiendo..." : "Completado"}
                  </span>
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: "#6C63FF" }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(108,99,255,0.1)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background:
                        isSuccess
                          ? "#00D4AA"
                          : "linear-gradient(90deg, #6C63FF, #00D4AA)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !isSuccess && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isUploading
                ? "rgba(108,99,255,0.4)"
                : "linear-gradient(135deg, #6C63FF, #5A52D5)",
              color: "#fff",
              boxShadow: isUploading
                ? "none"
                : "0 4px 20px rgba(108,99,255,0.35)",
            }}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subiendo archivo...
              </>
            ) : (
              <>
                <CloudUpload className="w-5 h-5" />
                Importar archivo
              </>
            )}
          </button>
        )}

        {/* Success Result */}
        {isSuccess && result && (
          <div
            className="rounded-2xl p-5 md:p-6 space-y-4"
            style={{
              background: "rgba(0,212,170,0.06)",
              border: "1px solid rgba(0,212,170,0.25)",
            }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 shrink-0" style={{ color: "#00D4AA" }} />
              <h3
                className="text-base font-semibold"
                style={{ color: "#00D4AA" }}
              >
                Importación completada
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.filas_insertadas !== undefined && (
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "rgba(0,212,170,0.08)" }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#00D4AA" }}
                  >
                    {result.filas_insertadas}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Filas insertadas
                  </p>
                </div>
              )}

              {result.tabla && (
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "rgba(108,99,255,0.08)" }}
                >
                  <div className="flex justify-center mb-1">
                    <Table className="w-6 h-6" style={{ color: "#6C63FF" }} />
                  </div>
                  <p
                    className="text-sm font-semibold break-all"
                    style={{ color: "#6C63FF" }}
                  >
                    {result.tabla}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Tabla destino
                  </p>
                </div>
              )}

              {result.errores !== undefined && (
                <div
                  className="rounded-xl p-4 text-center"
                  style={{
                    background:
                      result.errores > 0
                        ? "rgba(239,68,68,0.08)"
                        : "rgba(0,212,170,0.06)",
                  }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color: result.errores > 0 ? "#EF4444" : "#9CA3AF",
                    }}
                  >
                    {result.errores}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Errores
                  </p>
                </div>
              )}
            </div>

            {/* Raw response fallback */}
            {result.raw && (
              <div
                className="rounded-xl p-4 font-mono text-xs overflow-auto"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  color: "#9CA3AF",
                  maxHeight: "120px",
                }}
              >
                {result.raw}
              </div>
            )}

            {/* Additional fields */}
            {result.mensaje && (
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                {result.mensaje}
              </p>
            )}

            <button
              onClick={resetState}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-80"
              style={{
                background: "rgba(108,99,255,0.12)",
                color: "#6C63FF",
                border: "1px solid rgba(108,99,255,0.25)",
              }}
            >
              <Trash2 className="w-4 h-4" />
              Limpiar e importar otro
            </button>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: "#EF4444" }}
                >
                  Error al importar
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: "#FCA5A5" }}
                >
                  {errorMsg || "Ocurrió un error inesperado."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUpload}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-80"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "#EF4444",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <Upload className="w-4 h-4" />
                Reintentar
              </button>
              <button
                onClick={resetState}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-80"
                style={{
                  background: "rgba(108,99,255,0.10)",
                  color: "#6C63FF",
                  border: "1px solid rgba(108,99,255,0.2)",
                }}
              >
                <Trash2 className="w-4 h-4" />
                Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Hint */}
        {status === "idle" && !selectedFile && (
          <p className="text-center text-xs" style={{ color: "#374151" }}>
            Máximo recomendado: 50 MB · Los datos se procesarán de forma segura
            en el servidor
          </p>
        )}
      </div>
    </div>
  );
}