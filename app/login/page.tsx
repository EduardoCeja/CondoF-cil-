"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserRole = "administrador" | "residente" | "proveedor";

type User = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  unidad?: string;
  telefono?: string;
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

const LS_USERS = "users";
const LS_CURRENT_USER = "currentUser";
const LS_NOTIFICATIONS = "notifications";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const gradientStyle = useMemo(
    () => ({
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }),
    []
  );

  useEffect(() => {
    try {
      const current = localStorage.getItem(LS_CURRENT_USER);
      if (current) router.replace("/dashboard");
    } catch {
      // ignore
    }
  }, [router]);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(LS_USERS);
      if (!existing) {
        const demoUsers: User[] = [
          {
            id: "1",
            nombre: "Administrador Demo",
            email: "admin@condofacil.com",
            password: "admin123",
            rol: "administrador",
            unidad: "Admin",
            telefono: "5551234567",
          },
          {
            id: "2",
            nombre: "Residente Demo",
            email: "residente@condofacil.com",
            password: "residente123",
            rol: "residente",
            unidad: "101",
            telefono: "5559876543",
          },
        ];
        localStorage.setItem(LS_USERS, JSON.stringify(demoUsers));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(null), 4000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 2000);
    return () => clearTimeout(t);
  }, [successMsg]);

  function showError(message: string) {
    setSuccessMsg(null);
    setErrorMsg(message);
  }

  function showSuccess(message: string) {
    setErrorMsg(null);
    setSuccessMsg(message);
  }

  function seedNotificationsForUser(user: User) {
    try {
      const existing: AppNotification[] = JSON.parse(
        localStorage.getItem(LS_NOTIFICATIONS) || "[]"
      );

      const alreadyHasNotifications = existing.some((n) => n.userId === user.id);

      if (alreadyHasNotifications) return;

      const demoNotifications: AppNotification[] = [
        {
          id: crypto.randomUUID(),
          userId: user.id,
          tipo: "reserva",
          titulo: "Reserva confirmada",
          mensaje:
            "Tu reserva del salón de eventos fue confirmada para el día 12/05/2026 a las 18:00 hrs.",
          fecha: new Date().toISOString(),
          leida: false,
        },
        {
          id: crypto.randomUUID(),
          userId: user.id,
          tipo: "incidencia",
          titulo: "Actualización de incidencia",
          mensaje:
            "La incidencia #INC-2026-014 cambió a estatus: En proceso.",
          fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          leida: false,
        },
        {
          id: crypto.randomUUID(),
          userId: user.id,
          tipo: "pago",
          titulo: "Recordatorio de pago",
          mensaje:
            "Tienes un pago pendiente de mantenimiento con vencimiento el 15/05/2026.",
          fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          leida: false,
        },
      ];

      localStorage.setItem(
        LS_NOTIFICATIONS,
        JSON.stringify([...demoNotifications, ...existing])
      );
    } catch {
      // ignore
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    try {
      const users: User[] = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

      const user = users.find(
        (u) => u.email?.toLowerCase() === cleanEmail && u.password === password
      );

      if (user) {
        localStorage.setItem(LS_CURRENT_USER, JSON.stringify(user));
        seedNotificationsForUser(user);
        showSuccess("¡Bienvenido! Redirigiendo...");
        setTimeout(() => router.push("/dashboard"), 900);
      } else {
        showError("Credenciales incorrectas. Por favor, intenta de nuevo.");
      }
    } catch {
      showError("No se pudo acceder a localStorage en este navegador.");
    }
  }

  return (
    <main
      style={gradientStyle}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">CondoFácil</h1>
          <p className="text-gray-600 mt-2">Gestión inteligente de condominios</p>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-black font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 font-semibold shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Regístrate aquí
          </Link>
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>👤 Usuario demo:</strong>
          </p>
          <p className="text-xs text-gray-600">Email: admin@condofacil.com</p>
          <p className="text-xs text-gray-600">Contraseña: admin123</p>
        </div>
      </div>
    </main>
  );
}