"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: string;
  nombre: string;
  rol: string;
  unidad?: string;
};

type MetodoPago = "efectivo" | "transferencia" | "cheque" | "tarjeta" | "otro";
type ConceptoPago =
  | "mantenimiento"
  | "agua"
  | "estacionamiento"
  | "cuota_extraordinaria"
  | "otro";

type Pago = {
  id: string;
  residenteId: string;
  residenteNombre: string;
  unidad: string;
  concepto: ConceptoPago;
  conceptoPersonalizado: string;
  monto: number;
  periodo: string;
  metodoPago: MetodoPago;
  referencia: string;
  fechaPago: string;
  notas: string;
  registradoPor: string;
  estatus: "pagado";
  creadoEn: string;
};

const LS_USERS = "users";
const LS_PAGOS = "pagos";
const LS_CURRENT_USER = "currentUser";

const CONCEPTOS: { value: ConceptoPago; label: string }[] = [
  { value: "mantenimiento", label: "Cuota de mantenimiento" },
  { value: "agua", label: "Servicio de agua" },
  { value: "estacionamiento", label: "Estacionamiento" },
  { value: "cuota_extraordinaria", label: "Cuota extraordinaria" },
  { value: "otro", label: "Otro concepto" },
];

const METODOS: { value: MetodoPago; label: string; icon: string }[] = [
  { value: "efectivo", label: "Efectivo", icon: "💵" },
  { value: "transferencia", label: "Transferencia", icon: "🏦" },
  { value: "cheque", label: "Cheque", icon: "📄" },
  { value: "tarjeta", label: "Tarjeta", icon: "💳" },
  { value: "otro", label: "Otro", icon: "🔖" },
];

function buildPeriodOptions() {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = -6; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const raw = d.toLocaleDateString("es-MX", {
      month: "long",
      year: "numeric",
    });
    options.push({ value, label: raw.charAt(0).toUpperCase() + raw.slice(1) });
  }
  return options;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const PERIOD_OPTIONS = buildPeriodOptions();

export default function RegisterPaymentsPage() {
  const [residents, setResidents] = useState<User[]>([]);
  const [adminNombre, setAdminNombre] = useState("");

  const [residenteId, setResidenteId] = useState("");
  const [residenteNombre, setResidenteNombre] = useState("");
  const [unidad, setUnidad] = useState("");
  const [concepto, setConcepto] = useState<ConceptoPago>("mantenimiento");
  const [conceptoPersonalizado, setConceptoPersonalizado] = useState("");
  const [monto, setMonto] = useState("");
  const [periodo, setPeriodo] = useState(getCurrentPeriod());
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("transferencia");
  const [referencia, setReferencia] = useState("");
  const [fechaPago, setFechaPago] = useState(getToday());
  const [notas, setNotas] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedPago, setSavedPago] = useState<Pago | null>(null);

  useEffect(() => {
    try {
      const users: User[] = JSON.parse(
        localStorage.getItem(LS_USERS) || "[]"
      );
      setResidents(users.filter((u) => u.rol === "residente"));

      const current: User | null = JSON.parse(
        localStorage.getItem(LS_CURRENT_USER) || "null"
      );
      if (current) setAdminNombre(current.nombre);
    } catch {
      // ignore
    }
  }, []);

  function handleResidenteSelect(id: string) {
    setResidenteId(id);
    if (!id) {
      setResidenteNombre("");
      setUnidad("");
      return;
    }
    const found = residents.find((r) => r.id === id);
    if (found) {
      setResidenteNombre(found.nombre);
      setUnidad(found.unidad ?? "");
    }
  }

  function validate(): string | null {
    if (!residenteNombre.trim()) return "El nombre del residente es obligatorio.";
    if (!unidad.trim()) return "La unidad o departamento es obligatorio.";
    const montoNum = parseFloat(monto);
    if (!monto || isNaN(montoNum) || montoNum <= 0)
      return "El monto debe ser mayor a $0.";
    if (concepto === "otro" && !conceptoPersonalizado.trim())
      return "Especifica el concepto de pago.";
    if (!referencia.trim())
      return "La referencia o número de comprobante es obligatoria.";
    if (!fechaPago) return "La fecha de pago es obligatoria.";
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);

    try {
      const pagos: Pago[] = JSON.parse(localStorage.getItem(LS_PAGOS) || "[]");

      const nuevoPago: Pago = {
        id: crypto.randomUUID(),
        residenteId,
        residenteNombre: residenteNombre.trim(),
        unidad: unidad.trim().toUpperCase(),
        concepto,
        conceptoPersonalizado:
          concepto === "otro" ? conceptoPersonalizado.trim() : "",
        monto: parseFloat(parseFloat(monto).toFixed(2)),
        periodo,
        metodoPago,
        referencia: referencia.trim(),
        fechaPago,
        notas: notas.trim(),
        registradoPor: adminNombre || "Sistema",
        estatus: "pagado",
        creadoEn: new Date().toISOString(),
      };

      localStorage.setItem(LS_PAGOS, JSON.stringify([nuevoPago, ...pagos]));
      setSavedPago(nuevoPago);
    } catch {
      setErrorMsg("No se pudo guardar el pago. Intenta de nuevo.");
    }
  }

  function resetForm() {
    setSavedPago(null);
    setResidenteId("");
    setResidenteNombre("");
    setUnidad("");
    setConcepto("mantenimiento");
    setConceptoPersonalizado("");
    setMonto("");
    setPeriodo(getCurrentPeriod());
    setMetodoPago("transferencia");
    setReferencia("");
    setFechaPago(getToday());
    setNotas("");
    setErrorMsg(null);
  }

  // --- Success screen ---
  if (savedPago) {
    const metodoLabel = METODOS.find((m) => m.value === savedPago.metodoPago);
    const conceptoLabel =
      savedPago.concepto === "otro"
        ? savedPago.conceptoPersonalizado
        : CONCEPTOS.find((c) => c.value === savedPago.concepto)?.label ?? "";

    const [py, pm] = savedPago.periodo.split("-").map(Number);
    const periodoLabel = new Date(py, pm - 1).toLocaleDateString("es-MX", {
      month: "long",
      year: "numeric",
    });

    const fechaLabel = new Date(savedPago.fechaPago + "T12:00:00").toLocaleDateString(
      "es-MX",
      { dateStyle: "long" }
    );

    const montoLabel = savedPago.monto.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    const rows: [string, string][] = [
      ["Residente", savedPago.residenteNombre],
      ["Unidad", savedPago.unidad],
      ["Concepto", conceptoLabel],
      ["Periodo", periodoLabel.charAt(0).toUpperCase() + periodoLabel.slice(1)],
      ["Monto", montoLabel],
      ["Método de pago", `${metodoLabel?.icon ?? ""} ${metodoLabel?.label ?? ""}`],
      ["Referencia / Comprobante", savedPago.referencia],
      ["Fecha de pago", fechaLabel],
      ["Registrado por", savedPago.registradoPor],
    ];

    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl shadow p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-2xl font-bold text-emerald-800">
              Pago registrado correctamente
            </h2>
            <p className="text-emerald-700 mt-1 text-sm">
              El pago ha sido guardado en el sistema.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">
              Comprobante de pago
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500">{label}</p>
                  <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
              {savedPago.notas && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500">Notas</p>
                  <p className="font-medium text-gray-800 mt-0.5">
                    {savedPago.notas}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-black text-white hover:opacity-90 text-sm font-medium"
            >
              Registrar otro pago
            </button>
            <Link
              href="/payments/history"
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
            >
              Ver historial
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
            >
              Ir al panel
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- Form ---
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Registrar pago
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Captura el pago de un residente del condominio.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:underline text-sm whitespace-nowrap"
            >
              Volver al panel
            </Link>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* ── Sección 1: Residente ── */}
            <section>
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                1. Datos del residente
              </h2>

              {residents.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seleccionar residente registrado
                  </label>
                  <select
                    value={residenteId}
                    onChange={(e) => handleResidenteSelect(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">— Ingresar manualmente —</option>
                    {residents.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                        {r.unidad ? ` · Unidad ${r.unidad}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del residente{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={residenteNombre}
                    onChange={(e) => setResidenteNombre(e.target.value)}
                    placeholder="Ej. María García López"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad / Departamento{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    placeholder="Ej. 101, A-302"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </section>

            {/* ── Sección 2: Detalle del pago ── */}
            <section>
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                2. Detalle del pago
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={concepto}
                    onChange={(e) =>
                      setConcepto(e.target.value as ConceptoPago)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {CONCEPTOS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {concepto === "otro" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Especificar concepto{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={conceptoPersonalizado}
                      onChange={(e) =>
                        setConceptoPersonalizado(e.target.value)
                      }
                      placeholder="Ej. Reparación de fachada"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periodo <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {PERIOD_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (MXN) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">
                      $
                    </span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de pago <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fechaPago}
                    max={getToday()}
                    onChange={(e) => setFechaPago(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </section>

            {/* ── Sección 3: Método de pago ── */}
            <section>
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                3. Método de pago
              </h2>

              <div className="flex flex-wrap gap-3 mb-4">
                {METODOS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMetodoPago(m.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                      metodoPago === m.value
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    <span>{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia / No. de comprobante{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej. TRF-2026-001, EFVO-123, CHQ-456"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </section>

            {/* ── Sección 4: Notas ── */}
            <section>
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4">
                4. Notas adicionales
              </h2>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                placeholder="Observaciones, aclaraciones o información adicional del pago..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </section>

            {/* ── Acciones ── */}
            <div className="flex gap-3 pt-2 flex-wrap border-t">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-black text-white hover:opacity-90 font-medium mt-4"
              >
                Registrar pago
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium mt-4"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
