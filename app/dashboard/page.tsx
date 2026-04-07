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
};

type NotificationType = "reserva" | "incidencia" | "pago";

type AppNotification = {
  id: string;
  userId: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
};

const LS_CURRENT_USER = "currentUser";
const LS_NOTIFICATIONS = "notifications";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

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

      const allNotifications: AppNotification[] = JSON.parse(
        localStorage.getItem(LS_NOTIFICATIONS) || "[]"
      );

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
    const base =
      "border rounded-2xl p-4 transition shadow-sm";

    const unreadAccent = leida ? "" : " ring-2 ring-offset-1 ";

    switch (tipo) {
      case "reserva":
        return `${base} bg-blue-50 border-blue-200 ${unreadAccent}ring-blue-300`;
      case "incidencia":
        return `${base} bg-amber-50 border-amber-200 ${unreadAccent}ring-amber-300`;
      case "pago":
        return `${base} bg-emerald-50 border-emerald-200 ${unreadAccent}ring-emerald-300`;
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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Panel</h2>
              <p className="text-gray-600 mt-1">
                Elige una opción para comenzar.
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800">Tu sesión</p>
              <p>{user.email}</p>
              {user.unidad ? <p>Unidad: {user.unidad}</p> : null}
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
                  HU-23 Confirmación de reserva, HU-22 cambio de estatus y HU-21 recordatorio de pago.
                </p>
              </div>

              <div className="text-sm text-gray-600">
                No leídas:{" "}
                <span className="font-semibold text-gray-800">
                  {notifications.filter((n) => !n.leida).length}
                </span>
              </div>
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.tipo)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-800">
                              {notification.titulo}
                            </h4>
                            {!notification.leida && (
                              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                                Nueva
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