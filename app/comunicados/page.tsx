"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Comunicado = {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  imagen: string;
};

type FormComunicado = {
  titulo: string;
  descripcion: string;
  categoria: string;
};

export default function Comunicados() {
  const [form, setForm] = useState<FormComunicado>({
    titulo: "",
    descripcion: "",
    categoria: "",
  });

  const [mensajeExito, setMensajeExito] = useState("");

  const [avisos, setAvisos] = useState<Comunicado[]>([
    {
      id: 1,
      titulo: "Mantenimiento de alberca",
      descripcion:
        "Se informa a los residentes que el área de la alberca permanecerá cerrada por mantenimiento preventivo este fin de semana.",
      categoria: "Mantenimiento",
      fecha: "2026-04-10",
      imagen:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      titulo: "Corte temporal de agua",
      descripcion:
        "El suministro de agua será suspendido temporalmente el miércoles de 9:00 a 13:00 horas por trabajos en la red hidráulica.",
      categoria: "Servicios",
      fecha: "2026-04-09",
      imagen:
        "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      titulo: "Evento familiar en salón de usos múltiples",
      descripcion:
        "Este sábado se llevará a cabo una convivencia vecinal en el salón de eventos. Todos los residentes están cordialmente invitados.",
      categoria: "Eventos",
      fecha: "2026-04-08",
      imagen:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      titulo: "Nuevo reglamento de estacionamiento",
      descripcion:
        "Se recuerda a los residentes respetar los cajones asignados y evitar estacionarse en áreas comunes o lugares para visitas.",
      categoria: "Reglamento",
      fecha: "2026-04-07",
      imagen:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    },
  ]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const obtenerImagenPorCategoria = (categoria: string) => {
    switch (categoria) {
      case "Mantenimiento":
        return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80";
      case "Servicios":
        return "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80";
      case "Eventos":
        return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";
      case "Seguridad":
        return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
      case "Reglamento":
        return "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80";
      default:
        return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";
    }
  };

  const agregarAviso = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.titulo.trim() ||
      !form.descripcion.trim() ||
      !form.categoria.trim()
    ) {
      setMensajeExito("Completa todos los campos.");
      return;
    }

    const nuevoAviso: Comunicado = {
      id: Date.now(),
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria,
      fecha: new Date().toISOString().split("T")[0],
      imagen: obtenerImagenPorCategoria(form.categoria),
    };

    setAvisos((prev) => [nuevoAviso, ...prev]);

    setForm({
      titulo: "",
      descripcion: "",
      categoria: "",
    });

    setMensajeExito("Comunicado publicado correctamente.");

    setTimeout(() => {
      setMensajeExito("");
    }, 3000);
  };

  const badgeCategoria = (categoria: string) => {
    switch (categoria) {
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Servicios":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Eventos":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "Seguridad":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Reglamento":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">Comunicados</h1>

          <p className="mt-2 text-base text-gray-700">
            Publica avisos importantes para mantener informados a los residentes
            del condominio.
          </p>

          {mensajeExito && (
            <div
              className={`mt-5 rounded-lg px-4 py-3 text-sm font-semibold ${
                mensajeExito.includes("correctamente")
                  ? "border border-green-200 bg-green-100 text-green-800"
                  : "border border-red-200 bg-red-100 text-red-800"
              }`}
            >
              {mensajeExito}
            </div>
          )}

          <form
            onSubmit={agregarAviso}
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Título del comunicado *
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej. Corte temporal de agua"
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Escribe el contenido del comunicado"
                rows={5}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Categoría *
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Servicios">Servicios</option>
                <option value="Eventos">Eventos</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Reglamento">Reglamento</option>
              </select>
            </div>

            <div className="flex items-end md:col-span-1">
              <button
                type="submit"
                className="w-full rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 md:w-auto"
              >
                Publicar comunicado
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Historial de comunicados
              </h2>
              <p className="mt-1 text-sm text-gray-700">
                Consulta los avisos publicados para los residentes.
              </p>
            </div>
          </div>

          {avisos.length === 0 ? (
            <p className="mt-6 text-gray-700">No hay comunicados todavía.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {avisos.map((a) => (
                <article
                  key={a.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-52 w-full overflow-hidden bg-gray-200">
                    <img
                      src={a.imagen}
                      alt={a.titulo}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeCategoria(
                          a.categoria
                        )}`}
                      >
                        {a.categoria}
                      </span>

                      <span className="text-xs font-medium text-gray-500">
                        {new Date(a.fecha).toLocaleDateString("es-MX")}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {a.titulo}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {a.descripcion}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}