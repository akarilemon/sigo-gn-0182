const API_URL = "http://localhost:4000";

export const getExpedientes = () => fetch(`${API_URL}/expedientes`);

export const buscarExpedientes = (texto) => fetch(`${API_URL}/expedientes/buscar?texto=${encodeURIComponent(texto)}`);

export const crearExpediente = (data) => fetch(`${API_URL}/expedientes`,{
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
});

export const modificarExpediente = (data) => fetch(`${API_URL}/expedientes/${data.folio}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
});


export const eliminarExpediente = (data) => fetch(`${API_URL}/expedientes/${data.folio}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  
});
