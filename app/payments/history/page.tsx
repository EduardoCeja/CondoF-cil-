import Link from "next/link";

export default function PaymentsHistoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Historial de pagos</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Volver al panel
          </Link>
        </div>

        <p className="text-gray-600 mt-4">
          Aquí irá la tabla/consulta de pagos con filtros.
        </p>
      </div>
    </main>
  );
}