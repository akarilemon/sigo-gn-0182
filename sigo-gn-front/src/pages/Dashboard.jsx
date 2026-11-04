import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate(); 
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('sigoUsuario');
        return saved ? JSON.parse(saved) : null;
    });
    
    const handleLogout = () => {
        localStorage.removeItem('sigoUsuario');
        navigate('/login');
    };
    
    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>
            <h2>Usuario: {user.nombre}</h2>
            <button type="button" onClick={handleLogout}>Cerrar sesión</button>
        </div>

    )
}

export default Dashboard;