"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Movimiento = {
  id: string;
  fecha: string;
  concepto: string;
  cargo: number;
  abono: number;
};

type MovimientoConSaldo = Movimiento & { saldoAcum: number };

type EstadoCuenta = {
  id: string;
  residenteNombre: string;
  unidad: string;
  email: string;
  telefono: string;
  numeroCuenta: string;
  periodoLabel: string;
  fechaCorte: string;
  movimientos: Movimiento[];
};

function fmt(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function withBalance(movs: Movimiento[]): MovimientoConSaldo[] {
  let acc = 0;
  return movs.map((m) => {
    acc += m.cargo - m.abono;
    return { ...m, saldoAcum: acc };
  });
}

function getSaldoStatus(saldo: number): {
  label: string;
  color: string;
  bg: string;
  border: string;
  headerBg: string;
} {
  if (saldo <= 0)
    return {
      label: "AL CORRIENTE",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      headerBg: "bg-emerald-600",
    };
  if (saldo < 3000)
    return {
      label: "ADEUDO PARCIAL",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-300",
      headerBg: "bg-amber-500",
    };
  return {
    label: "ADEUDO",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-300",
    headerBg: "bg-red-600",
  };
}

const ESTADOS: EstadoCuenta[] = [
  {
    id: "ec-101",
    residenteNombre: "María García López",
    unidad: "101",
    email: "m.garcia@email.com",
    telefono: "55 1234-5678",
    numeroCuenta: "RF-2026-101",
    periodoLabel: "Enero – Mayo 2026",
    fechaCorte: "02/05/2026",
    movimientos: [
      { id: "a1", fecha: "01/01/2026", concepto: "Cuota de mantenimiento – Enero 2026", cargo: 1200, abono: 0 },
      { id: "a2", fecha: "05/01/2026", concepto: "Pago recibido – Transferencia TRF-0101", cargo: 0, abono: 1200 },
      { id: "a3", fecha: "08/01/2026", concepto: "Servicio de agua – Enero 2026", cargo: 250, abono: 0 },
      { id: "a4", fecha: "09/01/2026", concepto: "Pago recibido – Efectivo EFVO-0101", cargo: 0, abono: 250 },
      { id: "a5", fecha: "01/02/2026", concepto: "Cuota de mantenimiento – Febrero 2026", cargo: 1200, abono: 0 },
      { id: "a6", fecha: "04/02/2026", concepto: "Pago recibido – Transferencia TRF-0201", cargo: 0, abono: 1200 },
      { id: "a7", fecha: "07/02/2026", concepto: "Servicio de agua – Febrero 2026", cargo: 250, abono: 0 },
      { id: "a8", fecha: "08/02/2026", concepto: "Pago recibido – Efectivo EFVO-0201", cargo: 0, abono: 250 },
      { id: "a9", fecha: "01/03/2026", concepto: "Cuota de mantenimiento – Marzo 2026", cargo: 1200, abono: 0 },
      { id: "a10", fecha: "03/03/2026", concepto: "Pago recibido – Transferencia TRF-0301", cargo: 0, abono: 1200 },
      { id: "a11", fecha: "07/03/2026", concepto: "Servicio de agua – Marzo 2026", cargo: 250, abono: 0 },
      { id: "a12", fecha: "08/03/2026", concepto: "Pago recibido – Efectivo EFVO-0301", cargo: 0, abono: 250 },
      { id: "a13", fecha: "01/04/2026", concepto: "Cuota de mantenimiento – Abril 2026", cargo: 1200, abono: 0 },
      { id: "a14", fecha: "05/04/2026", concepto: "Pago recibido – Transferencia TRF-0401", cargo: 0, abono: 1200 },
      { id: "a15", fecha: "08/04/2026", concepto: "Servicio de agua – Abril 2026", cargo: 250, abono: 0 },
      { id: "a16", fecha: "09/04/2026", concepto: "Pago recibido – Efectivo EFVO-0401", cargo: 0, abono: 250 },
      { id: "a17", fecha: "01/05/2026", concepto: "Cuota de mantenimiento – Mayo 2026", cargo: 1200, abono: 0 },
      { id: "a18", fecha: "02/05/2026", concepto: "Pago recibido – Transferencia TRF-0501", cargo: 0, abono: 1200 },
      { id: "a19", fecha: "06/05/2026", concepto: "Servicio de agua – Mayo 2026", cargo: 250, abono: 0 },
      { id: "a20", fecha: "07/05/2026", concepto: "Pago recibido – Efectivo EFVO-0501", cargo: 0, abono: 250 },
    ],
  },
  {
    id: "ec-203",
    residenteNombre: "Carlos Mendoza Ruiz",
    unidad: "203",
    email: "c.mendoza@email.com",
    telefono: "55 9876-5432",
    numeroCuenta: "RF-2026-203",
    periodoLabel: "Enero – Mayo 2026",
    fechaCorte: "02/05/2026",
    movimientos: [
      { id: "b1", fecha: "01/01/2026", concepto: "Cuota de mantenimiento – Enero 2026", cargo: 1200, abono: 0 },
      { id: "b2", fecha: "06/01/2026", concepto: "Pago recibido – Transferencia TRF-0111", cargo: 0, abono: 1200 },
      { id: "b3", fecha: "08/01/2026", concepto: "Servicio de agua – Enero 2026", cargo: 250, abono: 0 },
      { id: "b4", fecha: "10/01/2026", concepto: "Pago recibido – Efectivo EFVO-0111", cargo: 0, abono: 250 },
      { id: "b5", fecha: "01/02/2026", concepto: "Cuota de mantenimiento – Febrero 2026", cargo: 1200, abono: 0 },
      { id: "b6", fecha: "05/02/2026", concepto: "Pago recibido – Transferencia TRF-0211", cargo: 0, abono: 1200 },
      { id: "b7", fecha: "07/02/2026", concepto: "Servicio de agua – Febrero 2026", cargo: 250, abono: 0 },
      { id: "b8", fecha: "09/02/2026", concepto: "Pago recibido – Efectivo EFVO-0211", cargo: 0, abono: 250 },
      { id: "b9", fecha: "01/03/2026", concepto: "Cuota de mantenimiento – Marzo 2026", cargo: 1200, abono: 0 },
      { id: "b10", fecha: "07/03/2026", concepto: "Pago recibido – Transferencia TRF-0311", cargo: 0, abono: 1200 },
      { id: "b11", fecha: "08/03/2026", concepto: "Servicio de agua – Marzo 2026", cargo: 250, abono: 0 },
      { id: "b12", fecha: "10/03/2026", concepto: "Pago recibido – Efectivo EFVO-0311", cargo: 0, abono: 250 },
      { id: "b13", fecha: "01/04/2026", concepto: "Cuota de mantenimiento – Abril 2026", cargo: 1200, abono: 0 },
      { id: "b14", fecha: "08/04/2026", concepto: "Servicio de agua – Abril 2026", cargo: 250, abono: 0 },
      { id: "b15", fecha: "01/05/2026", concepto: "Cuota de mantenimiento – Mayo 2026", cargo: 1200, abono: 0 },
      { id: "b16", fecha: "08/05/2026", concepto: "Servicio de agua – Mayo 2026", cargo: 250, abono: 0 },
    ],
  },
  {
    id: "ec-405",
    residenteNombre: "Ana López Martínez",
    unidad: "405",
    email: "a.lopez@email.com",
    telefono: "55 5555-1234",
    numeroCuenta: "RF-2026-405",
    periodoLabel: "Enero – Mayo 2026",
    fechaCorte: "02/05/2026",
    movimientos: [
      { id: "c1", fecha: "01/01/2026", concepto: "Cuota de mantenimiento – Enero 2026", cargo: 1200, abono: 0 },
      { id: "c2", fecha: "04/01/2026", concepto: "Pago recibido – Transferencia TRF-0121", cargo: 0, abono: 1200 },
      { id: "c3", fecha: "08/01/2026", concepto: "Servicio de agua – Enero 2026", cargo: 250, abono: 0 },
      { id: "c4", fecha: "10/01/2026", concepto: "Pago recibido – Efectivo EFVO-0121", cargo: 0, abono: 250 },
      { id: "c5", fecha: "01/02/2026", concepto: "Cuota de mantenimiento – Febrero 2026", cargo: 1200, abono: 0 },
      { id: "c6", fecha: "07/02/2026", concepto: "Servicio de agua – Febrero 2026", cargo: 250, abono: 0 },
      { id: "c7", fecha: "15/02/2026", concepto: "Cuota extraordinaria – Reparación de fachada", cargo: 800, abono: 0 },
      { id: "c8", fecha: "01/03/2026", concepto: "Cuota de mantenimiento – Marzo 2026", cargo: 1200, abono: 0 },
      { id: "c9", fecha: "08/03/2026", concepto: "Servicio de agua – Marzo 2026", cargo: 250, abono: 0 },
      { id: "c10", fecha: "20/03/2026", concepto: "Pago parcial – Efectivo EFVO-0321", cargo: 0, abono: 800 },
      { id: "c11", fecha: "01/04/2026", concepto: "Cuota de mantenimiento – Abril 2026", cargo: 1200, abono: 0 },
      { id: "c12", fecha: "08/04/2026", concepto: "Servicio de agua – Abril 2026", cargo: 250, abono: 0 },
      { id: "c13", fecha: "01/05/2026", concepto: "Cuota de mantenimiento – Mayo 2026", cargo: 1200, abono: 0 },
      { id: "c14", fecha: "08/05/2026", concepto: "Servicio de agua – Mayo 2026", cargo: 250, abono: 0 },
    ],
  },
];

function StatementCard({ ec }: { ec: EstadoCuenta }) {
  const movs = useMemo(() => withBalance(ec.movimientos), [ec.movimientos]);

  const totalCargos = ec.movimientos.reduce((s, m) => s + m.cargo, 0);
  const totalAbonos = ec.movimientos.reduce((s, m) => s + m.abono, 0);
  const saldoFinal = totalCargos - totalAbonos;
  const status = getSaldoStatus(saldoFinal);

  return (
    <article className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* ── Membrete ── */}
      <div className={`${status.headerBg} text-white px-6 py-4 flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2 text-2xl leading-none">🏢</div>
          <div>
            <p className="font-bold text-lg leading-tight">Residencial Las Palmas</p>
            <p className="text-white/80 text-xs">Av. Insurgentes Sur 1234, CDMX · Tel. 55 0000-0000</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/70 uppercase tracking-wide">Estado de Cuenta</p>
          <p className="font-semibold">{ec.periodoLabel}</p>
        </div>
      </div>

      {/* ── Info del residente ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="sm:pr-6 pb-3 sm:pb-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Datos del residente</p>
          <p className="font-bold text-gray-800">{ec.residenteNombre}</p>
          <p className="text-sm text-gray-600">Unidad / Departamento: <span className="font-medium text-gray-800">{ec.unidad}</span></p>
          <p className="text-sm text-gray-600">{ec.email}</p>
          <p className="text-sm text-gray-600">{ec.telefono}</p>
        </div>
        <div className="sm:pl-6 pt-3 sm:pt-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Datos de la cuenta</p>
          <p className="text-sm text-gray-600">No. de cuenta: <span className="font-mono font-medium text-gray-800">{ec.numeroCuenta}</span></p>
          <p className="text-sm text-gray-600">Período: <span className="font-medium text-gray-800">{ec.periodoLabel}</span></p>
          <p className="text-sm text-gray-600">Fecha de corte: <span className="font-medium text-gray-800">{ec.fechaCorte}</span></p>
          <p className="text-sm text-gray-600">
            Estatus:{" "}
            <span className={`font-semibold ${status.color}`}>{status.label}</span>
          </p>
        </div>
      </div>

      {/* ── Resumen ── */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total cargos</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{fmt(totalCargos)}</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total abonos</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{fmt(totalAbonos)}</p>
        </div>
        <div className={`p-4 text-center ${status.bg}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Saldo</p>
          <p className={`text-xl font-bold mt-1 ${status.color}`}>{fmt(saldoFinal)}</p>
          <p className={`text-xs font-semibold mt-0.5 ${status.color}`}>{status.label}</p>
        </div>
      </div>

      {/* ── Tabla de movimientos ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Fecha</th>
              <th className="text-left px-4 py-3 font-semibold">Concepto</th>
              <th className="text-right px-4 py-3 font-semibold">Cargo</th>
              <th className="text-right px-4 py-3 font-semibold">Abono</th>
              <th className="text-right px-4 py-3 font-semibold">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movs.map((m, i) => (
              <tr
                key={m.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/30 transition-colors`}
              >
                <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap font-mono text-xs">
                  {m.fecha}
                </td>
                <td className="px-4 py-2.5 text-gray-800">
                  {m.concepto}
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  {m.cargo > 0 ? (
                    <span className="text-red-600 font-medium">{fmt(m.cargo)}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  {m.abono > 0 ? (
                    <span className="text-emerald-600 font-medium">{fmt(m.abono)}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className={`px-4 py-2.5 text-right whitespace-nowrap font-semibold ${m.saldoAcum > 0 ? "text-red-600" : "text-emerald-700"}`}>
                  {fmt(m.saldoAcum)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={`${status.bg} border-t-2 ${status.border}`}>
              <td colSpan={2} className="px-4 py-3 font-bold text-gray-800">
                Saldo al corte · {ec.fechaCorte}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-800">{fmt(totalCargos)}</td>
              <td className="px-4 py-3 text-right font-bold text-emerald-700">{fmt(totalAbonos)}</td>
              <td className={`px-4 py-3 text-right font-bold text-lg ${status.color}`}>
                {fmt(saldoFinal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Pie del estado de cuenta ── */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs text-gray-500">
          Fecha límite de pago: <span className="font-medium text-gray-700">15/05/2026</span> · Administración: Tel. 55 0000-0000
        </p>
        <p className="text-xs text-gray-400">
          Documento generado el 02/05/2026 · CondoFácil
        </p>
      </div>
    </article>
  );
}

export default function ResidentStatementPage() {
  const [selected, setSelected] = useState<string>("all");

  const visible = selected === "all"
    ? ESTADOS
    : ESTADOS.filter((e) => e.id === selected);

  const summaries = useMemo(
    () =>
      ESTADOS.map((ec) => {
        const cargos = ec.movimientos.reduce((s, m) => s + m.cargo, 0);
        const abonos = ec.movimientos.reduce((s, m) => s + m.abono, 0);
        return { id: ec.id, nombre: ec.residenteNombre, unidad: ec.unidad, saldo: cargos - abonos };
      }),
    []
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Encabezado ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Estados de cuenta</h1>
            <p className="text-gray-600 text-sm mt-1">
              Saldo, cargos, abonos y movimientos por residente.
            </p>
          </div>
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm whitespace-nowrap">
            Volver al panel
          </Link>
        </div>

        {/* ── Tarjetas resumen ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaries.map((s) => {
            const st = getSaldoStatus(s.saldo);
            return (
              <button
                key={s.id}
                onClick={() => setSelected(selected === s.id ? "all" : s.id)}
                className={`text-left rounded-2xl border p-4 transition shadow-sm ${
                  selected === s.id
                    ? `${st.bg} ${st.border} ring-2 ring-offset-1 ${st.border}`
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Unidad {s.unidad}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${st.bg} ${st.color} ${st.border}`}>
                    {st.label}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">{s.nombre}</p>
                <p className={`text-xl font-bold mt-1 ${st.color}`}>{fmt(s.saldo)}</p>
              </button>
            );
          })}
        </div>

        {/* ── Filtro ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelected("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              selected === "all"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Todos
          </button>
          {ESTADOS.map((ec) => (
            <button
              key={ec.id}
              onClick={() => setSelected(selected === ec.id ? "all" : ec.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                selected === ec.id
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              Unidad {ec.unidad}
            </button>
          ))}
        </div>

        {/* ── Estados de cuenta ── */}
        {visible.map((ec) => (
          <StatementCard key={ec.id} ec={ec} />
        ))}
      </div>
    </main>
  );
}
