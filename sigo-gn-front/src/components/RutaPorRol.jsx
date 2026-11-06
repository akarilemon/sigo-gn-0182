import { Navigate, Outlet } from 'react-router-dom';
import { obtenerRol } from '../utils/permisos.js';

function RutaPorRol({ rolesPermitidos }) {
    const rol = obtenerRol();

    if (!rolesPermitidos.includes(rol)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default RutaPorRol;
