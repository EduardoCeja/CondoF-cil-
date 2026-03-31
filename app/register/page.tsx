"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserRole = "residente" | "administrador" | "proveedor";

type User = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  unidad?: string;
  telefono?: string;
  fechaRegistro: string;
};

const LS_USERS = "users";

export default function RegisterPage() {
  const router = useRouter();

  const gradientStyle = useMemo(
    () => ({
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }),
    []
  );

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<UserRole | "">("");
  const [unidad, setUnidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Ocultar errores automáticamente
  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(null), 4000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  function showError(message: string) {
    setSuccessMsg(null);
    setErrorMsg(message);
  }

  function showSuccess(message: string) {
    setErrorMsg(null);
    setSuccessMsg(message);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    // Validación passwords
    if (password !== confirmPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      showError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    if (!rol) {
      showError("Selecciona un rol");
      return;
    }

    try {
      const users: User[] = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

      // Verificar email existente
      if (users.find((u) => u.email.toLowerCase() === cleanEmail)) {
        showError("Este correo ya está registrado");
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        email: cleanEmail,
        password,
        rol: rol as UserRole,
        unidad: unidad.trim(),
        telefono: telefono.trim(),
        fechaRegistro: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(LS_USERS, JSON.stringify(users));

      showSuccess("¡Cuenta creada exitosamente! Redirigiendo...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      showError("No se pudo acceder a localStorage en este navegador.");
    }
  }

  return (
    <main
      style={gradientStyle}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl my-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full mb-3">
            <svg
              className="w-10 h-10 text-white"
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
          <h1 className="text-3xl font-bold text-gray-800">Crear Cuenta</h1>
          <p className="text-gray-600 mt-1">Únete a CondoFácil</p>
        </div>

        {/* Mensajes */}
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Rol *
              </label>
              <select
                required
                value={rol}
                onChange={(e) => setRol(e.target.value as UserRole | "")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="residente">Residente</option>
                <option value="administrador">Administrador</option>
                <option value="proveedor">Proveedor</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Unidad/Departamento
              </label>
              <input
                type="text"
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                placeholder="Ej: 101, Torre A-502"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="5551234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 font-semibold shadow-lg mt-6"
          >
            Crear Cuenta
          </button>
        </form>

        {/* Link a login */}
        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}