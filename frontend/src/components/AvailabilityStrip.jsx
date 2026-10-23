import Icon from './Icon';

const horas = ['18:00', '19:00', '20:00', '21:00', '22:00'];

export default function AvailabilityStrip({ reservas = [] }) {
  const franjas = horas.map((hora) => {
    const inicio = Number(hora.slice(0, 2));
    const cantidad = reservas.filter((reserva) => {
      const horaReserva = Number(String(reserva.hora_inicio || '').slice(0, 2));
      return horaReserva === inicio && !['cancelada', 'no_show'].includes(reserva.estado);
    }).length;
    const nivel = cantidad >= 3 ? 'alta' : cantidad >= 1 ? 'ocupado' : 'disponible';
    return { hora, cantidad, nivel };
  });

  return (
    <section className="availability panel-card">
      <div className="section-heading section-heading--compact">
        <div><span className="eyebrow"><Icon name="clock" size={15} /> CAPACIDAD POR FRANJA</span><h2>Disponibilidad del servicio</h2><p>Estimación visual basada en las reservas activas existentes.</p></div>
        <div className="availability__legend"><span><i className="dot dot--available" />Disponible</span><span><i className="dot dot--busy" />Ocupado</span><span><i className="dot dot--high" />Alta demanda</span></div>
      </div>
      <div className="availability__grid">
        {franjas.map((franja) => <div className={`slot slot--${franja.nivel}`} key={franja.hora}><strong>{franja.hora}</strong><span>{franja.nivel === 'alta' ? 'Alta demanda' : franja.nivel === 'ocupado' ? 'Ocupado' : 'Disponible'}</span><small>{franja.cantidad} {franja.cantidad === 1 ? 'reserva activa' : 'reservas activas'}</small></div>)}
      </div>
    </section>
  );
}
