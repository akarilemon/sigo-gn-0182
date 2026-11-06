import { obtenerRol } from "../utils/permisos.js";

const API_URL = "http://localhost:4000";
 
const rolHeader = () => ({ 'x-rol': obtenerRol() ?? '' });

export const getExpedientes = () => fetch(`${API_URL}/expedientes`);

export const buscarExpedientes = (texto) => fetch(`${API_URL}/expedientes/buscar?texto=${encodeURIComponent(texto)}`);

export const crearExpediente = (data) => fetch(`${API_URL}/expedientes`,{
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
    ...rolHeader(),
  },
  body: JSON.stringify(data)
});

export const modificarExpediente = (data) => fetch(`${API_URL}/expedientes/${data.folio}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    ...rolHeader(), 
  },
  body: JSON.stringify(data)
});


export const eliminarExpediente = (data) => fetch(`${API_URL}/expedientes/${data.folio}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    ...rolHeader(),
  },
  
});
