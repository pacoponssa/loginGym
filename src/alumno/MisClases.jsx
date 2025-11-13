import { CalendarDays } from "lucide-react";
import CalendarioClases from "../components/CalendarioClases";

export default function MisClases() {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <div className="bg-indigo-600 text-white rounded-full p-2 mr-4">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Clases</h1>
          <p className="text-sm text-gray-500">Aquí podés ver y cancelar tus próximas reservas.</p>
        </div>
      </div>

      <CalendarioClases />
    </div>
  );
}
