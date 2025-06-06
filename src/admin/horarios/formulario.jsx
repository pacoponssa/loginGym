import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const FormularioHorarios = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);

  const [horario, setHorario] = useState({
    idDisciplina: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    cupoMaximo: '',
  });

  useEffect(() => {
    axios.get('/disciplina').then(res => setDisciplinas(res.data.data));

    if (id !== 'nuevo') {
      const fetchHorario = async () => {
        try {
          setLoading(true);
          const respuesta = await axios.get(`/horario/${id}`);
          setHorario(respuesta.data.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchHorario();
    } else {
      setHorario({ idDisciplina: '', fecha: '', horaInicio: '', horaFin: '', cupoMaximo: '' });
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setHorario({ ...horario, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (id === 'nuevo') {
        await axios.post('/horario', horario);
      } else {
        await axios.put(`/horario/${id}`, horario);
      }
      navigate('/admin/horarios');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className='p-6 text-2xl font-bold text-center text-white bg-red-600'>
        {id !== 'nuevo' ? 'Editar Horario' : 'Crear Nuevo Horario'}
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">Disciplina:</label>
              <select
                name="idDisciplina"
                value={horario.idDisciplina}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccione una disciplina</option>
                {disciplinas.map(d => (
                  <option key={d.idDisciplina} value={d.idDisciplina}>{d.nombre}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">Fecha:</label>
              <input type="date" name="fecha" value={horario.fecha} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">Hora Inicio:</label>
              <input type="time" name="horaInicio" value={horario.horaInicio} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">Hora Fin:</label>
              <input type="time" name="horaFin" value={horario.horaFin} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">Cupo Máximo:</label>
              <input type="number" name="cupoMaximo" value={horario.cupoMaximo} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <div className='flex justify-center'>
              <button type="submit" className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                Guardar
              </button>
              <button type="button" onClick={() => navigate('/admin/horarios')} className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default FormularioHorarios;
