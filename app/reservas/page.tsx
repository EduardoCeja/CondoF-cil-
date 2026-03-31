"use client";

import { useState, FormEvent, ChangeEvent } from "react";

type Reserva = {
  id: number;
  fecha: string;
  hora: string;
  area: string;
  nombre: string;
  departamento: string;
  telefono: string;
  personas: number;
  duracion: number;
  observaciones: string;
  estatus: string;
};

type FormReserva = {
  fecha: string;
  hora: string;
  area: string;
  nombre: string;
  departamento: string;
  telefono: string;
  personas: string;
  duracion: string;
  observaciones: string;
};

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: 1,
      fecha: "2026-04-01",
      hora: "18:00",
      area: "Piscina",
      nombre: "Juan Pérez",
      departamento: "A-101",
      telefono: "3312345678",
      personas: 5,
      duracion: 2,
      observaciones: "Evento familiar",
      estatus: "Confirmada",
    },
    {
      id: 2,
      fecha: "2026-04-02",
      hora: "20:00",
      area: "Salón de eventos",
      nombre: "María López",
      departamento: "B-202",
      telefono: "3319876543",
      personas: 15,
      duracion: 4,
      observaciones: "Cumpleaños",
      estatus: "Pendiente",
    },
    {
      id: 3,
      fecha: "2026-04-03",
      hora: "09:00",
      area: "Gimnasio",
      nombre: "Carlos Ramírez",
      departamento: "C-305",
      telefono: "3324567812",
      personas: 2,
      duracion: 1,
      observaciones: "Entrenamiento personal",
      estatus: "Confirmada",
    },
    {
      id: 4,
      fecha: "2026-04-04",
      hora: "17:00",
      area: "Cancha",
      nombre: "Ana Torres",
      departamento: "D-110",
      telefono: "3337654321",
      personas: 10,
      duracion: 2,
      observaciones: "Partido amistoso",
      estatus: "Confirmada",
    },
    {
      id: 5,
      fecha: "2026-04-05",
      hora: "13:00",
      area: "Piscina",
      nombre: "Luis Mendoza",
      departamento: "A-204",
      telefono: "3311122233",
      personas: 6,
      duracion: 3,
      observaciones: "Reunión de fin de semana",
      estatus: "Pendiente",
    },
    {
      id: 6,
      fecha: "2026-04-06",
      hora: "19:00",
      area: "Salón de eventos",
      nombre: "Fernanda Ruiz",
      departamento: "B-108",
      telefono: "3319988776",
      personas: 20,
      duracion: 5,
      observaciones: "Cena de aniversario",
      estatus: "Confirmada",
    },
    {
      id: 7,
      fecha: "2026-04-07",
      hora: "08:00",
      area: "Gimnasio",
      nombre: "Ricardo Soto",
      departamento: "C-201",
      telefono: "3332211455",
      personas: 1,
      duracion: 2,
      observaciones: "Rutina matutina",
      estatus: "Cancelada",
    },
    {
      id: 8,
      fecha: "2026-04-08",
      hora: "16:00",
      area: "Cancha",
      nombre: "Patricia Vega",
      departamento: "D-302",
      telefono: "3321123344",
      personas: 8,
      duracion: 2,
      observaciones: "Práctica deportiva",
      estatus: "Pendiente",
    },
    {
      id: 9,
      fecha: "2026-04-09",
      hora: "12:00",
      area: "Piscina",
      nombre: "Diego Navarro",
      departamento: "A-303",
      telefono: "3339981122",
      personas: 4,
      duracion: 2,
      observaciones: "Convivencia familiar",
      estatus: "Confirmada",
    },
    {
      id: 10,
      fecha: "2026-04-10",
      hora: "18:30",
      area: "Salón de eventos",
      nombre: "Sofía Herrera",
      departamento: "B-405",
      telefono: "3317766554",
      personas: 30,
      duracion: 6,
      observaciones: "Fiesta privada",
      estatus: "Pendiente",
    },
  ]);

  const [form, setForm] = useState<FormReserva>({
    fecha: "",
    hora: "",
    area: "",
    nombre: "",
    departamento: "",
    telefono: "",
    personas: "",
    duracion: "",
    observaciones: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const agregarReserva = (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.fecha ||
      !form.hora ||
      !form.area ||
      !form.nombre ||
      !form.departamento
    ) {
      setMensaje("Completa los campos obligatorios.");
      return;
    }

    const nueva: Reserva = {
      id: reservas.length + 1,
      fecha: form.fecha,
      hora: form.hora,
      area: form.area,
      nombre: form.nombre,
      departamento: form.departamento,
      telefono: form.telefono,
      personas: Number(form.personas) || 0,
      duracion: Number(form.duracion) || 0,
      observaciones: form.observaciones,
      estatus: "Confirmada",
    };

    setReservas((prev) => [nueva, ...prev]);

    setForm({
      fecha: "",
      hora: "",
      area: "",
      nombre: "",
      departamento: "",
      telefono: "",
      personas: "",
      duracion: "",
      observaciones: "",
    });

    setMensaje("Reserva creada correctamente.");
    setTimeout(() => setMensaje(""), 3000);
  };

  const getBadgeStyles = (estatus: string) => {
    if (estatus === "Confirmada") {
      return "bg-green-100 text-green-800 border border-green-200";
    }
    if (estatus === "Pendiente") {
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
    return "bg-red-100 text-red-800 border border-red-200";
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Reserva de áreas comunes
          </h1>

          <p className="mt-2 text-base text-gray-700">
            Registra una nueva reserva para las áreas disponibles del condominio.
          </p>

          {mensaje && (
            <div
              className={`mt-5 rounded-lg px-4 py-3 text-sm font-semibold ${
                mensaje.includes("correctamente")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {mensaje}
            </div>
          )}

          <form
            onSubmit={agregarReserva}
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Hora *
              </label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Área *
              </label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              >
                <option value="">Selecciona un área</option>
                <option value="Piscina">Piscina</option>
                <option value="Salón de eventos">Salón de eventos</option>
                <option value="Gimnasio">Gimnasio</option>
                <option value="Cancha">Cancha</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Nombre del residente *
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Juan Pérez"
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Departamento *
              </label>
              <input
                type="text"
                name="departamento"
                placeholder="Ej. A-101"
                value={form.departamento}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                placeholder="Ej. 3312345678"
                value={form.telefono}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Número de personas
              </label>
              <input
                type="number"
                name="personas"
                placeholder="Ej. 10"
                value={form.personas}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Duración (horas)
              </label>
              <input
                type="number"
                name="duracion"
                placeholder="Ej. 3"
                value={form.duracion}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                placeholder="Agrega información adicional de la reserva"
                value={form.observaciones}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                Reservar
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Historial de reservas
          </h2>

          <p className="mt-2 text-sm text-gray-700">
            Consulta las reservas registradas para las áreas comunes.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50 text-left text-xs font-bold uppercase tracking-wider text-gray-800">
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Área</th>
                  <th className="px-4 py-4">Fecha</th>
                  <th className="px-4 py-4">Hora</th>
                  <th className="px-4 py-4">Residente</th>
                  <th className="px-4 py-4">Depto</th>
                  <th className="px-4 py-4">Teléfono</th>
                  <th className="px-4 py-4">Personas</th>
                  <th className="px-4 py-4">Duración</th>
                  <th className="px-4 py-4">Observaciones</th>
                  <th className="px-4 py-4">Estatus</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {reservas.map((r) => (
                  <tr key={r.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      #{r.id}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {r.area}
                    </td>
                    <td className="px-4 py-4 text-gray-800">{r.fecha}</td>
                    <td className="px-4 py-4 text-gray-800">{r.hora}</td>
                    <td className="px-4 py-4 text-gray-800">{r.nombre}</td>
                    <td className="px-4 py-4 text-gray-800">{r.departamento}</td>
                    <td className="px-4 py-4 text-gray-800">{r.telefono}</td>
                    <td className="px-4 py-4 text-gray-800">{r.personas}</td>
                    <td className="px-4 py-4 text-gray-800">
                      {r.duracion} h
                    </td>
                    <td className="max-w-[220px] px-4 py-4 text-gray-700">
                      {r.observaciones || "Sin observaciones"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getBadgeStyles(
                          r.estatus
                        )}`}
                      >
                        {r.estatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}