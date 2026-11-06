import { Link } from 'react-router-dom';
import { ROLES, PERMISOS, aSimbolico } from '../utils/permisos.js';

function Permisos() {
    return (
        <div>
            <Link to="/dashboard">← Menú</Link>
            <h1>Roles y permisos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rol</th>
                        <th>Octal</th>
                        <th>Binario</th>
                        <th>Simbólico</th>
                        <th>Ver (4)</th>
                        <th>Editar (2)</th>
                        <th>Eliminar (1)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(ROLES).map(([rol, octal]) => (
                        <tr key={rol}>
                            <td>{rol}</td>
                            <td>{octal}</td>
                            <td>{octal.toString(2).padStart(3, '0')}</td>
                            <td><code>{aSimbolico(octal)}</code></td>
                            <td>{(octal & PERMISOS.LEER) ? 'Sí' : 'No'}</td>
                            <td>{(octal & PERMISOS.ESCRIBIR) ? 'Sí' : 'No'}</td>
                            <td>{(octal & PERMISOS.ELIMINAR) ? 'Sí' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Permisos;
