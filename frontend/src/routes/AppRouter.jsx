import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardPage from '../pages/DashboardPage';
import ClientesPage from '../pages/ClientesPage';
import MesasPage from '../pages/MesasPage';
import ReservasPage from '../pages/ReservasPage';
import NuevaReservaPage from '../pages/NuevaReservaPage';
import ReservaDetallePage from '../pages/ReservaDetallePage';
import AsistenteIAPage from '../pages/AsistenteIAPage';
import AsistenteFlotante from '../components/AsistenteFlotante';
export default function AppRouter() {
  return <BrowserRouter><Navbar><Routes>
    <Route path="/" element={<DashboardPage />} /><Route path="/clientes" element={<ClientesPage />} />
    <Route path="/mesas" element={<MesasPage />} /><Route path="/reservas" element={<ReservasPage />} />
    <Route path="/reservas/:id" element={<ReservaDetallePage />} /><Route path="/nueva-reserva" element={<NuevaReservaPage />} />
    <Route path="/asistente" element={<AsistenteIAPage />} />
    <Route path="*" element={<DashboardPage />} />
  </Routes></Navbar><AsistenteFlotante /></BrowserRouter>;
}
