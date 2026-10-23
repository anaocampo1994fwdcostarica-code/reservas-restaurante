import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon';
import logoCasonaLaly from '../assets/restaurante/logo-casona-laly.png';

const enlaces = [
  { to: '/', label: 'Agenda', icono: 'dashboard', end: true },
  { to: '/reservas', label: 'Reservas', icono: 'calendar' },
  { to: '/nueva-reserva', label: 'Nueva reserva', icono: 'plus' },
  { to: '/clientes', label: 'Clientes', icono: 'users' },
  { to: '/mesas', label: 'Mesas', icono: 'table' }
];

export default function Navbar({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const renderEnlaces = (movil = false) => enlaces.map(({ to, label, icono, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      onClick={() => setMenuAbierto(false)}
      className={({ isActive }) => [
        'topnav-link',
        movil ? 'topnav-link--mobile' : '',
        isActive ? 'active' : ''
      ].filter(Boolean).join(' ')}
    >
      <Icon name={icono} size={17} />
      <span>{label}</span>
    </NavLink>
  ));

  return (
    <div className="app-shell app-shell--topnav">
      <header className="topbar topbar--navigation">
        <Link
          to="/"
          className="topbar__brand"
          aria-label="La Casona de Laly, ir a Agenda"
          onClick={() => setMenuAbierto(false)}
        >
          <span className="topbar__brand-logo" aria-hidden="true">
            <img src={logoCasonaLaly} alt="" />
          </span>
          <span className="topbar__brand-copy">
            <strong>La Casona de Laly</strong>
            <small>Reservas y operaciones de sala</small>
          </span>
        </Link>

        <nav className="topbar__nav" aria-label="Navegación principal">
          {renderEnlaces()}
        </nav>

        <div className="topbar__right">
          <div className="topbar__service-status">
            <span className="status-dot" aria-hidden="true" />
            <span>Servicio activo</span>
          </div>

          <Link to="/nueva-reserva" className="button button--primary topbar__new">
            <Icon name="plus" size={17} />
            Nueva reserva
          </Link>

          <div className="topbar__profile" aria-label="Perfil de Ana Ocampo">
            <span className="avatar avatar--profile">AO</span>
            <span className="topbar__profile-copy">
              <strong>Ana Ocampo</strong>
              <small>Maître</small>
            </span>
          </div>

          <button
            type="button"
            className="topbar__menu"
            aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <Icon name={menuAbierto ? 'close' : 'menu'} size={21} />
          </button>
        </div>
      </header>

      {menuAbierto && (
        <nav className="topbar__mobile-nav" aria-label="Navegación principal móvil">
          {renderEnlaces(true)}
        </nav>
      )}

      <main className="main-content">{children}</main>
    </div>
  );
}
