import { Link } from 'react-router-dom';
import EstadoBadge from './EstadoBadge';
import Icon from './Icon';
import { obtenerIniciales } from '../utils/formato';

export default function ReservaItem({ reserva, noShows = 0 }) {
  return (
    <tr>
      <td><div className="time-cell"><strong>{reserva.hora_inicio?.slice(0, 5)}</strong><span>{reserva.fecha?.slice(0, 10)}</span></div></td>
      <td><div className="person-cell"><span className="avatar">{obtenerIniciales(reserva.cliente_nombre)}</span><div><strong>{reserva.cliente_nombre}</strong><span>{reserva.cliente_telefono}</span></div></div></td>
      <td><span className="with-icon"><Icon name="people" size={16} />{reserva.personas}</span></td>
      <td><div className="table-location"><strong>Mesa {reserva.mesa_numero}</strong><span>{reserva.mesa_ubicacion}</span></div></td>
      <td><div className="badge-stack"><EstadoBadge estado={reserva.estado} />{Number(noShows) > 0 && <span className="risk-badge">Ausencias previas: {noShows}</span>}</div></td>
      <td><span className={`note-preview ${reserva.nota ? '' : 'muted'}`} title={reserva.nota || ''}>{reserva.nota || 'Sin nota'}</span></td>
      <td><Link className="detail-link" to={`/reservas/${reserva.id}`}>Ver detalle <Icon name="arrow" size={15} /></Link></td>
    </tr>
  );
}
