import { useEffect, useRef, useState } from 'react';

export function useApi(funcionApi) {
  const funcionInicial = useRef(funcionApi);
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
    let vigente = true;

    async function cargaInicial() {
      try {
        const resultado = await funcionInicial.current();
        if (vigente) setDatos(resultado);
      } catch (error) {
        if (vigente) setError(error.message);
      } finally {
        if (vigente) setCargando(false);
      }
    }

    cargaInicial();
    return () => {
      vigente = false;
    };
  }, []);

  return {
    datos,
    cargando,
    error,
    recargar: cargarDatos
  };
}
