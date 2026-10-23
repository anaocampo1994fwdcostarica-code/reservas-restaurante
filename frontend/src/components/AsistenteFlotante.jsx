import { useRef, useState } from 'react';
import { api } from '../services/api';
import Icon from './Icon';

const consultasEjemplo = [
  'Mesa para 4 personas el 23 de octubre de 2026 a las 18:00 en la terraza',
  '¿Qué mesas están disponibles para 2 personas hoy a las 19:00?',
  'Necesito una mesa para 6 personas mañana a las 20:30'
];

const saludoInicial = 'Hola, soy La Casona de Laly IA. Puedo consultar la disponibilidad real de mesas. Indícame fecha, hora, cantidad de personas y ubicación.';

export default function AsistenteFlotante() {
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [consultando, setConsultando] = useState(false);
  const [mensajes, setMensajes] = useState([{ id: 'saludo-inicial', tipo: 'asistente', contenido: saludoInicial }]);
  const contadorMensajes = useRef(0);

  function agregarMensaje(tipo, contenido, esError = false) {
    contadorMensajes.current += 1;
    const mensaje = { id: `${tipo}-${Date.now()}-${contadorMensajes.current}`, tipo, contenido, esError };
    setMensajes((actuales) => [...actuales, mensaje]);
  }

  async function enviarConsulta() {
    const texto = consulta.trim();
    if (!texto || consultando) return;
    agregarMensaje('usuario', texto);
    setConsulta('');
    setConsultando(true);
    try {
      const respuesta = await api.consultarAsistenteIA(texto);
      agregarMensaje('asistente', respuesta);
    } catch (error) {
      agregarMensaje('asistente', error.message, true);
    } finally {
      setConsultando(false);
    }
  }

  function manejarEnvio(evento) { evento.preventDefault(); enviarConsulta(); }
  function manejarTecla(evento) {
    if (evento.key === 'Enter' && !evento.shiftKey) { evento.preventDefault(); enviarConsulta(); }
  }

  return (
    <div className="ai-floating">
      {abierto && <section className="ai-chat-panel" role="dialog" aria-label="Asistente IA de disponibilidad">
        <header className="ai-chat-panel__header"><div className="ai-chat-panel__identity"><div className="ai-chat-panel__mark"><Icon name="sparkles" size={19} /></div><div><strong>La Casona de Laly IA</strong><span><i /> Disponibilidad de mesas</span></div></div><button className="ai-chat-panel__close" type="button" onClick={() => setAbierto(false)} aria-label="Cerrar asistente"><Icon name="close" size={18} /></button></header>
        <div className="ai-chat-history" aria-live="polite" aria-label="Conversación con el asistente">
          {mensajes.map((mensaje) => <article key={mensaje.id} className={`ai-chat-message ai-chat-message--${mensaje.tipo} ${mensaje.esError ? 'ai-chat-message--error' : ''}`}>{mensaje.tipo === 'asistente' && <div className="ai-chat-avatar"><Icon name={mensaje.esError ? 'alert' : 'sparkles'} size={15} /></div>}<div className="ai-chat-bubble"><p>{mensaje.contenido}</p></div></article>)}
          {consultando && <article className="ai-chat-message ai-chat-message--asistente" role="status"><div className="ai-chat-avatar"><Icon name="sparkles" size={15} /></div><div className="ai-chat-bubble ai-chat-bubble--loading"><span className="ai-chat-loader"><i /><i /><i /></span><p>Consultando mesas y reservas reales...</p></div></article>}
        </div>
        <form className="ai-chat-composer" onSubmit={manejarEnvio}>
          <div className="ai-chat-suggestions" aria-label="Consultas de ejemplo">{consultasEjemplo.map((ejemplo) => <button type="button" key={ejemplo} onClick={() => setConsulta(ejemplo)} disabled={consultando}>{ejemplo}</button>)}</div>
          <label className="sr-only" htmlFor="consulta-flotante">Escribe una consulta de disponibilidad</label>
          <textarea id="consulta-flotante" value={consulta} onChange={(evento) => setConsulta(evento.target.value)} onKeyDown={manejarTecla} placeholder="Escribe tu consulta..." disabled={consultando} rows="3" />
          <div className="ai-chat-composer__footer"><span><kbd>Enter</kbd> enviar · <kbd>Shift + Enter</kbd> nueva línea</span><button className="button button--primary ai-chat-send" type="submit" disabled={consultando || !consulta.trim()}><Icon name="arrow" size={16} /> {consultando ? 'Consultando...' : 'Enviar'}</button></div>
        </form>
      </section>}
      <button className="ai-floating__button" type="button" onClick={() => setAbierto((actual) => !actual)} aria-label="Consultar disponibilidad con IA" aria-expanded={abierto}><Icon name={abierto ? 'close' : 'bot'} size={22} /><span role="tooltip">Consultar disponibilidad con IA</span></button>
    </div>
  );
}
