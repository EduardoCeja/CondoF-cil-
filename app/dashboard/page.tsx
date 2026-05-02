"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CurrentUser = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  unidad?: string;
  condominioId?: string;
};

type Condominio = {
  id: string;
  nombre: string;
  direccion: string;
  totalUnidades: number;
};

type NotificationType = "reserva" | "incidencia" | "pago" | "condominio";

type AppNotification = {
  id: string;
  userId: string;
  condominioId?: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
};

const LS_CURRENT_USER = "currentUser";
const LS_NOTIFICATIONS = "notifications";
const LS_CONDOMINIOS = "condominios";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [condominio, setCondominio] = useState<Condominio | null>(null);

  const navItems = useMemo(
    () => [
      {
        href: "/payments/register",
        title: "Registrar pagos de residentes",
        description: "Captura pagos, método, periodo y comprobante.",
        icon: "🧾",
      },
      {
        href: "/payments/history",
        title: "Historial de pagos",
        description: "Consulta movimientos por fecha, residente y estatus.",
        icon: "📚",
      },
      {
        href: "/resident/statement",
        title: "Estado de cuenta del residente",
        description: "Saldo, adeudos, pagos aplicados y periodos.",
        icon: "💳",
      },
      {
        href: "/incidencias",
        title: "Reporte de incidencias",
        description:
          "Permite a los residentes reportar problemas dentro del condominio.",
        icon: "⚠️",
      },
      {
        href: "/reservas",
        title: "Reservas de áreas",
        description: "Permite gestionar la reserva de espacios comunes.",
        icon: "📅",
      },
      {
        href: "/comunicados",
        title: "Comunicados",
        description: "Permite publicar avisos para los residentes.",
        icon: "📢",
      },
    ],
    []
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_CURRENT_USER);
      if (!raw) {
        router.replace("/login");
        return;
      }

      const parsedUser: CurrentUser = JSON.parse(raw);
      setUser(parsedUser);

      // --- Seed / load condominio ---
      const condominios: Condominio[] = JSON.parse(
        localStorage.getItem(LS_CONDOMINIOS) || "[]"
      );

      let activeCondominio: Condominio;
      if (condominios.length === 0) {
        activeCondominio = {
          id: "condo-1",
          nombre: "Residencial Las Palmas",
          direccion: "Av. Insurgentes Sur 1234, CDMX",
          totalUnidades: 48,
        };
        localStorage.setItem(
          LS_CONDOMINIOS,
          JSON.stringify([activeCondominio])
        );
      } else {
        activeCondominio =
          condominios.find(
            (c) => c.id === (parsedUser.condominioId ?? "condo-1")
          ) ?? condominios[0];
      }
      setCondominio(activeCondominio);

      // --- Seed broadcast notifications for the condominio ---
      let allNotifications: AppNotification[] = JSON.parse(
        localStorage.getItem(LS_NOTIFICATIONS) || "[]"
      );

      const hasBroadcasts = allNotifications.some(
        (n) =>
          n.userId === "broadcast" && n.condominioId === activeCondominio.id
      );

      if (!hasBroadcasts) {
        const now = Date.now();
        const broadcasts: AppNotification[] = [
          {
            id: `bc-mant-${activeCondominio.id}`,
            userId: "broadcast",
            condominioId: activeCondominio.id,
            tipo: "condominio",
            titulo: "Mantenimiento programado",
            mensaje:
              "Se realizará mantenimiento a la bomba de agua el próximo sábado de 8:00 a 14:00 hrs. Se recomienda almacenar agua.",
            fecha: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
            leida: false,
          },
          {
            id: `bc-asam-${activeCondominio.id}`,
            userId: "broadcast",
            condominioId: activeCondominio.id,
            tipo: "condominio",
            titulo: "Asamblea de residentes",
            mensaje:
              "Se convoca a asamblea general el próximo viernes a las 19:00 hrs en el salón de eventos. Temas: presupuesto anual y reglamento.",
            fecha: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
            leida: false,
          },
          {
            id: `bc-seg-${activeCondominio.id}`,
            userId: "broadcast",
            condominioId: activeCondominio.id,
            tipo: "condominio",
            titulo: "Aviso de seguridad",
            mensaje:
              "Se implementa nuevo protocolo de acceso con tarjeta. Recoger credenciales en administración a partir del lunes.",
            fecha: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
            leida: false,
          },
        ];
        allNotifications = [...allNotifications, ...broadcasts];
        localStorage.setItem(
          LS_NOTIFICATIONS,
          JSON.stringify(allNotifications)
        );
      }

      // --- Fan-out broadcast notifications to the current user ---
      const broadcastsForCondo = allNotifications.filter(
        (n) =>
          n.userId === "broadcast" && n.condominioId === activeCondominio.id
      );

      const newFanouts: AppNotification[] = [];
      for (const bc of broadcastsForCondo) {
        const personalId = `${bc.id}-u${parsedUser.id}`;
        if (!allNotifications.some((n) => n.id === personalId)) {
          newFanouts.push({ ...bc, id: personalId, userId: parsedUser.id });
        }
      }

      if (newFanouts.length > 0) {
        allNotifications = [...allNotifications, ...newFanouts];
        localStorage.setItem(
          LS_NOTIFICATIONS,
          JSON.stringify(allNotifications)
        );
      }

      // --- Load user's personal notifications ---
      const userNotifications = allNotifications
        .filter((n) => n.userId === parsedUser.id)
        .sort(
          (a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );

      setNotifications(userNotifications);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem(LS_CURRENT_USER);
    router.push("/login");
  }

  function markAsRead(notificationId: string) {
    try {
      const allNotifications: AppNotification[] = JSON.parse(
        localStorage.getItem(LS_NOTIFICATIONS) || "[]"
      );

      const updated = allNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, leida: true }
          : notification
      );

      localStorage.setItem(LS_NOTIFICATIONS, JSON.stringify(updated));

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, leida: true }
            : notification
        )
      );
    } catch {
      // ignore
    }
  }

  function getNotificationStyles(tipo: NotificationType, leida: boolean) {
    const base = "border rounded-2xl p-4 transition shadow-sm";
    const unreadAccent = leida ? "" : " ring-2 ring-offset-1 ";

    switch (tipo) {
      case "reserva":
        return `${base} bg-blue-50 border-blue-200 ${unreadAccent}ring-blue-300`;
      case "incidencia":
        return `${base} bg-amber-50 border-amber-200 ${unreadAccent}ring-amber-300`;
      case "pago":
        return `${base} bg-emerald-50 border-emerald-200 ${unreadAccent}ring-emerald-300`;
      case "condominio":
        return `${base} bg-violet-50 border-violet-200 ${unreadAccent}ring-violet-300`;
      default:
        return `${base} bg-gray-50 border-gray-200`;
    }
  }

  function getNotificationIcon(tipo: NotificationType) {
    switch (tipo) {
      case "reserva":
        return "📅";
      case "incidencia":
        return "⚠️";
      case "pago":
        return "💳";
      case "condominio":
        return "🏢";
      default:
        return "🔔";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 grid place-items-center p-6">
        <p className="text-gray-600">Cargando sesión...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">CondoFácil</h1>
            <p className="text-sm text-gray-600">
              Bienvenido, <span className="font-medium">{user.nombre}</span>{" "}
              <span className="text-gray-400">({user.rol})</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Panel</h2>
              <p className="text-gray-600 mt-1">
                Elige una opción para comenzar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {condominio && (
                <div className="text-sm bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                  <p className="font-semibold text-violet-800">
                    🏢 {condominio.nombre}
                  </p>
                  <p className="text-violet-700 mt-0.5">{condominio.direccion}</p>
                  <p className="text-violet-600 mt-0.5">
                    {condominio.totalUnidades} unidades
                    {user.unidad ? ` · Unidad: ${user.unidad}` : ""}
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">Tu sesión</p>
                <p>{user.email}</p>
                {user.unidad ? <p>Unidad: {user.unidad}</p> : null}
              </div>
            </div>
          </div>

          {/* Notificaciones Sprint 6 */}
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Notificaciones
                </h3>
                <p className="text-sm text-gray-600">
                  HU-23 Confirmación de reserva · HU-22 Cambio de estatus · HU-21 Recordatorio de pago · Avisos del condominio.
                </p>
              </div>

              <div className="text-sm text-gray-600">
                No leídas:{" "}
                <span className="font-semibold text-gray-800">
                  {notifications.filter((n) => !n.leida).length}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { tipo: "📅 Reserva", bg: "bg-blue-50 border-blue-200 text-blue-700" },
                { tipo: "⚠️ Incidencia", bg: "bg-amber-50 border-amber-200 text-amber-700" },
                { tipo: "💳 Pago", bg: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                { tipo: "🏢 Condominio", bg: "bg-violet-50 border-violet-200 text-violet-700" },
              ].map((item) => (
                <span
                  key={item.tipo}
                  className={`text-xs px-2 py-1 rounded-full border ${item.bg}`}
                >
                  {item.tipo}
                </span>
              ))}
            </div>

            {notifications.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-500">
                No tienes notificaciones disponibles.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={getNotificationStyles(
                      notification.tipo,
                      notification.leida
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl shrink-0">
                        {getNotificationIcon(notification.tipo)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-800">
                            {notification.titulo}
                          </h4>
                          {!notification.leida && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                              Nueva
                            </span>
                          )}
                          {notification.tipo === "condominio" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                              Condominio
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 mt-2">
                          {notification.mensaje}
                        </p>

                        <p className="text-xs text-gray-500 mt-3">
                          {formatDate(notification.fecha)}
                        </p>
                      </div>
                    </div>

                    {!notification.leida && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-4 px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                      >
                        Marcar como leída
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group border rounded-2xl p-5 hover:shadow-md transition bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:underline">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick menu */}
          <div className="mt-8 border-t pt-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Navegación rápida
            </p>
            <nav className="flex flex-col sm:flex-row gap-2 flex-wrap">
              {navItems.map((item) => (
                <Link
                  key={item.href + "-quick"}
                  href={item.href}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
