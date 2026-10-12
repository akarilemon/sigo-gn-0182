import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function RutaProtegida() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('sigoUsuario');
        return saved ? JSON.parse(saved) : null;
    });

    if(!user) {
        return <Navigate to="/login"/>;
    }

    if(user) {
        return <Outlet />;
    }
}

export default RutaProtegida;
