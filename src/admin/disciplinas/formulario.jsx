import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const FormularioDisciplinas = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [disciplina, setDisciplina] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    if (id !== 'nueva') {
      const fetchDisciplina = async () => {
        try {
          setLoading(true);
          const respuesta = await axios.get(`/disciplina/${id}`);
          setDisciplina(respuesta.data.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchDisciplina();
    } else {
      setDisciplina({ nombre: '', descripcion: '' });
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDisciplina({ ...disciplina, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (id === 'nueva') {
        await axios.post('/disciplina', disciplina);
      } else {
        await axios.put(`/disciplina/${id}`, disciplina);
      }
      navigate('/admin/disciplinas');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className='p-6 text-2xl font-bold text-center text-white bg-red-600'>
        {id !== 'nueva' ? 'Editar Disciplina' : 'Crear Nueva Disciplina'}
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="nombre">
                Nombre:
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                name="nombre"
                value={disciplina.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="descripcion">
                Descripción:
              </label>
              <textarea
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="descripcion"
                name="descripcion"
                value={disciplina.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className='flex justify-center'>
              <button
                className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => navigate('/admin/disciplinas')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FormularioDisciplinas;
