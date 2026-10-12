import { useState } from 'react';
import "../styles/login.css"
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const { login, error } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { usern: user, password };
        login(data);
        navigate('/dashboard');
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="form-cont">
                <div>
                    <label htmlFor="user">Usuario:</label>
                    <input
                        type="text"
                        id="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Iniciar sesión</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default Login;