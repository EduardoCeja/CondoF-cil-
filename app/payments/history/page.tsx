"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type SortField = "fechaPago" | "residenteNombre" | "monto" | "metodoPago" | "periodo";

const LS_PAGOS = "pagos";

const METODO_META: Record<MetodoPago, { label: string; icon: string; color: string }> = {
  efectivo:      { label: "Efectivo",      icon: "💵", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  transferencia: { label: "Transferencia", icon: "🏦", color: "bg-blue-100 text-blue-700 border-blue-200" },
  cheque:        { label: "Cheque",        icon: "📄", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  tarjeta:       { label: "Tarjeta",       icon: "💳", color: "bg-violet-100 text-violet-700 border-violet-200" },
  otro:          { label: "Otro",          icon: "🔖", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

const CONCEPTO_LABELS: Record<ConceptoPago, string> = {
  mantenimiento:        "Cuota de mantenimiento",
  agua:                 "Servicio de agua",
  estacionamiento:      "Estacionamiento",
  cuota_extraordinaria: "Cuota extraordinaria",
  otro:                 "Otro",
};

function fmt(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function fmtPeriod(p: string) {
  const [y, m] = p.split("-").map(Number);
  const s = new Date(y, m - 1).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmtDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("es-MX", {
    dateStyle: "medium",
  });
}

function mk(
  id: string,
  nombre: string,
  unidad: string,
  concepto: ConceptoPago,
  monto: number,
  periodo: string,
  metodo: MetodoPago,
  ref: string,
  fecha: string,
  notas = ""
): Pago {
  return {
    id,
    residenteId: `r-${unidad}`,
    residenteNombre: nombre,
    unidad,
    concepto,
    conceptoPersonalizado: "",
    monto,
    periodo,
    metodoPago: metodo,
    referencia: ref,
    fechaPago: fecha,
    notas,
    registradoPor: "Admin Demo",
    estatus: "pagado",
    creadoEn: `${fecha}T10:00:00Z`,
  };
}

const DEMO_PAGOS: Pago[] = [
  // Enero 2026
  mk("d01","María García López",  "101","mantenimiento",1200,"2026-01","transferencia","TRF-2601-001","2026-01-05"),
  mk("d02","María García López",  "101","agua",          250, "2026-01","efectivo",     "EFVO-2601-001","2026-01-09"),
  mk("d03","Carlos Mendoza Ruiz", "203","mantenimiento",1200,"2026-01","transferencia","TRF-2601-002","2026-01-06"),
  mk("d04","Carlos Mendoza Ruiz", "203","agua",          250, "2026-01","efectivo",     "EFVO-2601-002","2026-01-10"),
  mk("d05","Ana López Martínez",  "405","mantenimiento",1200,"2026-01","transferencia","TRF-2601-003","2026-01-04"),
  mk("d06","Ana López Martínez",  "405","agua",          250, "2026-01","efectivo",     "EFVO-2601-003","2026-01-10"),
  // Febrero 2026
  mk("d07","María García López",  "101","mantenimiento",1200,"2026-02","transferencia","TRF-2602-001","2026-02-04"),
  mk("d08","María García López",  "101","agua",          250, "2026-02","efectivo",     "EFVO-2602-001","2026-02-08"),
  mk("d09","Carlos Mendoza Ruiz", "203","mantenimiento",1200,"2026-02","transferencia","TRF-2602-002","2026-02-05"),
  mk("d10","Carlos Mendoza Ruiz", "203","agua",          250, "2026-02","efectivo",     "EFVO-2602-002","2026-02-09"),
  // Marzo 2026
  mk("d11","María García López",  "101","mantenimiento",1200,"2026-03","transferencia","TRF-2603-001","2026-03-03"),
  mk("d12","María García López",  "101","agua",          250, "2026-03","efectivo",     "EFVO-2603-001","2026-03-08"),
  mk("d13","Carlos Mendoza Ruiz", "203","mantenimiento",1200,"2026-03","transferencia","TRF-2603-002","2026-03-07"),
  mk("d14","Carlos Mendoza Ruiz", "203","agua",          250, "2026-03","efectivo",     "EFVO-2603-002","2026-03-10"),
  {
    ...mk("d15","Ana López Martínez","405","otro",800,"2026-03","efectivo","EFVO-2603-003","2026-03-20","Pago parcial acordado con administración"),
    conceptoPersonalizado: "Pago parcial de adeudo",
  },
  // Abril 2026
  mk("d16","María García López",  "101","mantenimiento",1200,"2026-04","tarjeta",      "CARD-2604-001","2026-04-05"),
  mk("d17","María García López",  "101","agua",          250, "2026-04","efectivo",     "EFVO-2604-001","2026-04-09"),
  mk("d18","Roberto Sánchez Vega","302","mantenimiento",1200,"2026-04","cheque",        "CHQ-2604-001", "2026-04-03"),
  mk("d19","Roberto Sánchez Vega","302","agua",          250, "2026-04","cheque",        "CHQ-2604-002", "2026-04-03"),
  mk("d20","Roberto Sánchez Vega","302","estacionamiento",350,"2026-04","transferencia","TRF-2604-003","2026-04-03"),
  // Mayo 2026
  mk("d21","María García López",  "101","mantenimiento",1200,"2026-05","transferencia","TRF-2605-001","2026-05-02"),
  mk("d22","María García López",  "101","agua",          250, "2026-05","efectivo",     "EFVO-2605-001","2026-05-07"),
  mk("d23","Roberto Sánchez Vega","302","mantenimiento",1200,"2026-05","transferencia","TRF-2605-002","2026-05-04"),
  {
    ...mk("d24","Lucía Ramírez Torres","508","cuota_extraordinaria",800,"2026-05","tarjeta","CARD-2605-001","2026-05-01","Cuota aprobada en asamblea del 30 abr"),
    conceptoPersonalizado: "",
  },
];

export default function PaymentsHistoryPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroConcepto, setFiltroConcepto] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [sortField, setSortField] = useState<SortField>("fechaPago");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Pago | null>(null);

  useEffect(() => {
    try {
      const stored: Pago[] = JSON.parse(localStorage.getItem(LS_PAGOS) || "[]");
      if (stored.length === 0) {
        localStorage.setItem(LS_PAGOS, JSON.stringify(DEMO_PAGOS));
        setPagos(DEMO_PAGOS);
      } else {
        const ids = new Set(stored.map((p) => p.id));
        const merged = [...stored, ...DEMO_PAGOS.filter((d) => !ids.has(d.id))];
        setPagos(merged);
      }
    } catch {
      setPagos(DEMO_PAGOS);
    }
  }, []);

  const periodos = useMemo(() => {
    const set = new Set(pagos.map((p) => p.periodo));
    return [...set].sort().reverse();
  }, [pagos]);

  const filtered = useMemo(() => {
    let r = [...pagos];
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      r = r.filter(
        (p) =>
          p.residenteNombre.toLowerCase().includes(q) ||
          p.referencia.toLowerCase().includes(q) ||
          p.unidad.toLowerCase().includes(q)
      );
    }
    if (filtroMetodo) r = r.filter((p) => p.metodoPago === filtroMetodo);
    if (filtroConcepto) r = r.filter((p) => p.concepto === filtroConcepto);
    if (filtroPeriodo) r = r.filter((p) => p.periodo === filtroPeriodo);

    r.sort((a, b) => {
      const va =
        sortField === "monto"
          ? a.monto
          : (a[sortField] as string);
      const vb =
        sortField === "monto"
          ? b.monto
          : (b[sortField] as string);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return r;
  }, [pagos, busqueda, filtroMetodo, filtroConcepto, filtroPeriodo, sortField, sortDir]);

  const totalMonto = filtered.reduce((s, p) => s + p.monto, 0);
  const promedio = filtered.length > 0 ? totalMonto / filtered.length : 0;

  const metodosBreakdown = useMemo(() => {
    const map: Partial<Record<MetodoPago, { count: number; total: number }>> = {};
    for (const p of filtered) {
      if (!map[p.metodoPago]) map[p.metodoPago] = { count: 0, total: 0 };
      map[p.metodoPago]!.count++;
      map[p.metodoPago]!.total += p.monto;
    }
    return map;
  }, [filtered]);

  const hasFilters = !!(busqueda || filtroMetodo || filtroConcepto || filtroPeriodo);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  function clearFilters() {
    setBusqueda(""); setFiltroMetodo(""); setFiltroConcepto(""); setFiltroPeriodo("");
  }

  function sortArrow(field: SortField) {
    if (sortField !== field) return <span className="text-gray-300 ml-0.5">↕</span>;
    return <span className="ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const conceptoLabel = (p: Pago) =>
    p.concepto === "otro" && p.conceptoPersonalizado
      ? p.conceptoPersonalizado
      : CONCEPTO_LABELS[p.concepto];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Encabezado ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Historial de pagos</h1>
            <p className="text-gray-600 text-sm mt-1">
              Consulta, filtra y ordena todos los pagos registrados en el condominio.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/payments/register"
              className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90 font-medium"
            >
              + Registrar pago
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
            >
              Panel
            </Link>
          </div>
        </div>

        {/* ── Filtros ── */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Filtros
            </h2>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:underline"
              >
                Limpiar todo
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔍  Residente, referencia, unidad…"
              className="sm:col-span-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Todos los periodos</option>
              {periodos.map((p) => (
                <option key={p} value={p}>
                  {fmtPeriod(p)}
                </option>
              ))}
            </select>
            <select
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Todos los métodos</option>
              <option value="efectivo">💵 Efectivo</option>
              <option value="transferencia">🏦 Transferencia</option>
              <option value="cheque">📄 Cheque</option>
              <option value="tarjeta">💳 Tarjeta</option>
              <option value="otro">🔖 Otro</option>
            </select>
            <select
              value={filtroConcepto}
              onChange={(e) => setFiltroConcepto(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Todos los conceptos</option>
              <option value="mantenimiento">Cuota de mantenimiento</option>
              <option value="agua">Servicio de agua</option>
              <option value="estacionamiento">Estacionamiento</option>
              <option value="cuota_extraordinaria">Cuota extraordinaria</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        {/* ── Estadísticas ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pagos</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{filtered.length}</p>
            {hasFilters && (
              <p className="text-xs text-blue-600 mt-0.5">de {pagos.length} totales</p>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total recaudado</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{fmt(totalMonto)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Promedio por pago</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{fmt(promedio)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Desglose por método</p>
            <div className="flex flex-col gap-1">
              {(Object.entries(metodosBreakdown) as [MetodoPago, { count: number; total: number }][]).map(
                ([metodo, { count, total }]) => (
                  <div key={metodo} className="flex items-center justify-between text-xs">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${METODO_META[metodo].color}`}>
                      {METODO_META[metodo].icon} {METODO_META[metodo].label}
                      <span className="font-semibold ml-1">×{count}</span>
                    </span>
                    <span className="text-gray-600 font-medium">{fmt(total)}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── Tabla ── */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
              pago{filtered.length !== 1 ? "s" : ""}
              {hasFilters && <span className="text-blue-600"> · filtrados</span>}
            </p>
            <p className="text-xs text-gray-400">Haz clic en los encabezados para ordenar</p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-semibold text-gray-700">Sin resultados</p>
              <p className="text-sm mt-1">Ajusta los filtros o registra un nuevo pago.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 text-left font-semibold w-8">#</th>
                    <th
                      className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-gray-800"
                      onClick={() => toggleSort("fechaPago")}
                    >
                      Fecha {sortArrow("fechaPago")}
                    </th>
                    <th
                      className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-gray-800"
                      onClick={() => toggleSort("residenteNombre")}
                    >
                      Residente {sortArrow("residenteNombre")}
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Concepto</th>
                    <th
                      className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-gray-800"
                      onClick={() => toggleSort("periodo")}
                    >
                      Periodo {sortArrow("periodo")}
                    </th>
                    <th
                      className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-gray-800"
                      onClick={() => toggleSort("metodoPago")}
                    >
                      Método {sortArrow("metodoPago")}
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Referencia</th>
                    <th
                      className="px-4 py-3 text-right font-semibold cursor-pointer select-none hover:text-gray-800"
                      onClick={() => toggleSort("monto")}
                    >
                      Monto {sortArrow("monto")}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p, idx) => {
                    const meta = METODO_META[p.metodoPago];
                    return (
                      <tr
                        key={p.id}
                        className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-blue-50/30 transition-colors`}
                      >
                        <td className="px-4 py-3 text-gray-400 text-xs tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap tabular-nums">
                          {fmtDate(p.fechaPago)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 whitespace-nowrap">
                            {p.residenteNombre}
                          </p>
                          <p className="text-xs text-gray-500">Unidad {p.unidad}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-40">
                          <span className="block truncate">{conceptoLabel(p)}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {fmtPeriod(p.periodo)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${meta.color}`}
                          >
                            {meta.icon} {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                          {p.referencia}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800 whitespace-nowrap tabular-nums">
                          {fmt(p.monto)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelected(p)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 border-t-2 border-gray-300">
                    <td colSpan={7} className="px-4 py-3 font-semibold text-gray-700 text-sm">
                      Total · {filtered.length} pago{filtered.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700 text-base tabular-nums">
                      {fmt(totalMonto)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de detalle ── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-800">Detalle del pago</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              {/* Status badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium">
                  ✅ Pagado
                </span>
                <span className={`text-sm px-3 py-1 rounded-full border font-medium ${METODO_META[selected.metodoPago].color}`}>
                  {METODO_META[selected.metodoPago].icon} {METODO_META[selected.metodoPago].label}
                </span>
              </div>

              {/* Amount highlight */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Monto pagado</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{fmt(selected.monto)}</p>
              </div>

              {/* Fields grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {(
                  [
                    ["Residente", selected.residenteNombre],
                    ["Unidad", selected.unidad],
                    ["Concepto", conceptoLabel(selected)],
                    ["Periodo", fmtPeriod(selected.periodo)],
                    ["Referencia", selected.referencia],
                    ["Fecha de pago", fmtDate(selected.fechaPago)],
                    ["Registrado por", selected.registradoPor],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
                {selected.notas && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Notas</p>
                    <p className="font-medium text-gray-800 mt-0.5">{selected.notas}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
