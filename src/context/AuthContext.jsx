import { createContext, useContext, useState, useEffect } from "react";
import { users } from "../data/users.js"

const AuthContext = createContext(null);

export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("contexto debe estar dentro de un contexto!");
    }
    return auth;
}

export function AuthProvider({children}) {
    
    const [error, setError] = useState(null);
    //const [user, setUser] = useState(null);
    //const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setError(null);
            //setIsLoading(false);
        }, 3000);
    }, [error]);

    const login = (data) => {
        const{usern, password} = data;
        
        const user = users.find((u) => u.user === usern && u.password === password);
        if (user) {
            setError(null);
            const aguayo = {
                user: user.user,
                nombre: user.nombre,
                rol: user.rol
            }
            localStorage.setItem('sigoUsuario', JSON.stringify(aguayo));
        } else {
            setError('Usuario o contraseña incorrectos');
            return;
        }
    }
        
    return( 
        <AuthContext.Provider value={{ error, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;