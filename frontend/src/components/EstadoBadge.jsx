const etiquetas = {
  pendiente: 'Pendiente', confirmada: 'Confirmada', cumplida: 'Cumplida',
  cancelada: 'Cancelada', no_show: 'No asistió'
};
export default function EstadoBadge({ estado }) {
  return <span className={`badge badge--${estado}`}>{etiquetas[estado] || estado}</span>;
}
