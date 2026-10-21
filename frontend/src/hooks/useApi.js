import { useEffect, useState } from 'react';

export function useApi(funcionApi) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarDatos() {
    try {
      setCargando(true);
      setError('');

      const resultado = await funcionApi();
      setDatos(resultado);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    datos,
    cargando,
    error,
    recargar: cargarDatos
  };
}