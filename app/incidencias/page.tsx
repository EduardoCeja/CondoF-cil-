"use client";

import { FormEvent, useState } from "react";

type Incidencia = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  estatus: string;
};

export default function IncidenciasPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [incidencias, setIncidencias] = useState<Incidencia[]>([
    {
      id: 1,
      titulo: "Luz dañada en estacionamiento",
      descripcion: "La lámpara del área de estacionamiento no enciende desde ayer.",
      fecha: "2026-03-30T10:15:00",
      estatus: "Pendiente",
    },
    {
      id: 2,
      titulo: "Fuga de agua en jardín común",
      descripcion: "Se detectó una fuga cerca de la toma principal del jardín.",
      fecha: "2026-03-29T18:40:00",
      estatus: "En revisión",
    },
    {
      id: 3,
      titulo: "Puerta principal no cierra",
      descripcion: "El acceso principal queda abierto y representa riesgo de seguridad.",
      fecha: "2026-03-28T21:10:00",
      estatus: "Pendiente",
    },
    {
      id: 4,
      titulo: "Elevador fuera de servicio",
      descripcion: "El elevador del edificio B no funciona correctamente.",
      fecha: "2026-03-27T09:30:00",
      estatus: "Resuelto",
    },
    {
      id: 5,
      titulo: "Basura acumulada",
      descripcion: "Contenedores llenos en área común.",
      fecha: "2026-03-26T14:00:00",
      estatus: "En revisión",
    },
    {
      id: 6,
      titulo: "Falla en intercomunicador",
      descripcion: "No se puede abrir la puerta desde el departamento.",
      fecha: "2026-03-25T20:45:00",
      estatus: "Pendiente",
    },
    {
      id: 7,
      titulo: "Agua con baja presión",
      descripcion: "En torre A la presión del agua es muy baja.",
      fecha: "2026-03-24T07:20:00",
      estatus: "Resuelto",
    },
    {
      id: 8,
      titulo: "Iluminación deficiente en pasillos",
      descripcion: "Algunos focos no funcionan en el segundo piso.",
      fecha: "2026-03-23T19:10:00",
      estatus: "En revisión",
    },
    {
      id: 9,
      titulo: "Ruido excesivo en área común",
      descripcion: "Eventos sin control de horario.",
      fecha: "2026-03-22T23:50:00",
      estatus: "Pendiente",
    },
    {
      id: 10,
      titulo: "Portón automático falla",
      descripcion: "No abre con control remoto.",
      fecha: "2026-03-21T16:35:00",
      estatus: "Resuelto",
    },
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim()) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    const nuevaIncidencia: Incidencia = {
      id: incidencias.length + 1,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fecha: new Date().toISOString(),
      estatus: "Pendiente",
    };

    setIncidencias((prev) => [nuevaIncidencia, ...prev]);
    setTitulo("");
    setDescripcion("");
    setMensaje("La incidencia se agregó correctamente.");

    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* FORMULARIO */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            Reporte de incidencias
          </h1>

          <p className="text-gray-600 mt-2">
            Reporta problemas dentro del condominio.
          </p>

          {mensaje && (
            <div
              className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
                mensaje.includes("correctamente")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del problema"
              className="w-full border rounded-lg p-3"
            />

            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
              className="w-full border rounded-lg p-3"
              rows={4}
            />

            <button className="bg-black text-white px-4 py-2 rounded-lg">
              Enviar reporte
            </button>
          </form>
        </div>

        {/* TABLA */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Historial de incidencias
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 uppercase text-xs border-b">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estatus</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {incidencias.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 font-medium text-gray-700">
                      #{i.id}
                    </td>

                    <td className="px-4 py-4 font-semibold text-gray-800">
                      {i.titulo}
                    </td>

                    <td className="px-4 py-4 text-gray-600 max-w-xs truncate">
                      {i.descripcion}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      <div className="flex flex-col">
                        <span>
                          {new Date(i.fecha).toLocaleDateString("es-MX")}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(i.fecha).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          i.estatus === "Pendiente"
                            ? "bg-yellow-100 text-yellow-700"
                            : i.estatus === "En revisión"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {i.estatus}
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