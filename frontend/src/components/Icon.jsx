const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  table: <><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 17v4M17 17v4M7 7V3M17 7V3"/></>,
  utensils: <><path d="M3 2v7a3 3 0 0 0 3 3V2M9 2v7a3 3 0 0 1-3 3v10M18 2v20M14 2v6a4 4 0 0 0 4 4"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>, close: <path d="M18 6 6 18M6 6l12 12"/>,
  search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>, arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, check: <path d="m5 12 4 4L19 6"/>,
  alert: <><path d="M10.3 3.7 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></>,
  people: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.98.72 2.9a2 2 0 0 1-.45 2.11L8.1 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.92.35 1.9.59 2.9.72A2 2 0 0 1 22 16.92Z"/>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
  note: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
  trend: <><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></>, chevron: <path d="m9 18 6-6-6-6"/>,
  back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h10"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  sparkles: <><path d="m12 3-1.1 3.1a7 7 0 0 1-4.3 4.3L3.5 11.5l3.1 1.1a7 7 0 0 1 4.3 4.3L12 20l1.1-3.1a7 7 0 0 1 4.3-4.3l3.1-1.1-3.1-1.1a7 7 0 0 1-4.3-4.3Z"/><path d="m19 3-.35 1a2.3 2.3 0 0 1-1.4 1.4l-1 .35 1 .35a2.3 2.3 0 0 1 1.4 1.4l.35 1 .35-1a2.3 2.3 0 0 1 1.4-1.4l1-.35-1-.35A2.3 2.3 0 0 1 19.35 4Z"/></>,
  bot: <><rect x="4" y="5" width="16" height="13" rx="3"/><path d="M12 2v3M8 10h.01M16 10h.01M8 14h8"/><path d="M8 18v3M16 18v3"/><path d="M18 17.5 21 20v-4.2"/></>,
  save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></>
};
export default function Icon({ name, size = 20, className = '' }) {
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.alert}</svg>;
}
