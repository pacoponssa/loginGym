import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AsignarDisciplinas = () => {
  const { id } = useParams(); // id del usuario
  const [disciplinas, setDisciplinas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const cargarDisciplinas = async () => {
      try {
        const res = await axios.get("/disciplina");
        setDisciplinas(res.data.data);

        const inscritas = await axios.get(`/inscripcion/${id}/disciplina`);
        const ids = inscritas.data.data.map((i) => i.idDisciplina);
        setSeleccionadas(ids);
      } catch (error) {
        console.error("Error al cargar disciplinas", error);
      }
    };

    cargarDisciplinas();
  }, [id]);

  const toggleDisciplina = (disciplinaId) => {
    if (seleccionadas.includes(disciplinaId)) {
      setSeleccionadas(seleccionadas.filter((id) => id !== disciplinaId));
    } else {
      setSeleccionadas([...seleccionadas, disciplinaId]);
    }
  };

  const guardarAsignaciones = async () => {
    try {
      await axios.post(`/inscripcion/${id}/disciplina`, {
        idsDisciplinas: seleccionadas, // ✅ así coincide con el controller
      });
      setMensaje("Disciplinas actualizadas correctamente");
    } catch (error) {
      console.error("Error al asignar disciplinas", error);
      setMensaje("Hubo un error al guardar");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Asignar Disciplinas</h2>
      {mensaje && <p className="mb-2 text-center">{mensaje}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {disciplinas.map((disc) => (
          <label key={disc.idDisciplina} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={seleccionadas.includes(disc.idDisciplina)}
              onChange={() => toggleDisciplina(disc.idDisciplina)}
            />
            {disc.nombre}
          </label>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={guardarAsignaciones}
      >
        Guardar Cambios
      </button>
    </div>
  );
};

export default AsignarDisciplinas;
