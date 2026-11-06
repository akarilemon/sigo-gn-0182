import {useEffect, useState} from "react";
import Modal from "../components/Modal";
import "../styles/expedientes.css";
import {Link} from "react-router-dom";
import {tienePermiso, obtenerRol, PERMISOS} from "../utils/permisos.js";

import {getExpedientes, buscarExpedientes, crearExpediente, modificarExpediente, eliminarExpediente} from "../api/api.js";

const CLASE_ESTATUS = {
  "Abierto": "estatus-abierto",
  "En proceso": "estatus-en-proceso",
  "Cerrado": "estatus-cerrado"
};

const POR_PAGINA = 10;

const PESO_PRIORIDAD = {"Alta": 1, "Media": 2, "Baja": 3};

const valorOrden = (expediente, campo) => {
  if (campo === "folio") return parseInt(expediente.folio, 10) || 0;
  if (campo === "prioridad") return PESO_PRIORIDAD[expediente.prioridad] ?? 99;
  return expediente[campo] ?? ""; // fechaCreacion: las fechas ISO se ordenan bien como texto
};

const formatearFecha = (iso) => iso ? new Date(iso).toLocaleString("es-MX") : "—";

function Expedientes() {
  const rol = obtenerRol();
  const puedeEscribir = tienePermiso(rol, PERMISOS.ESCRIBIR);
  const puedeEliminar = tienePermiso(rol, PERMISOS.ELIMINAR);
  const mostrarOpciones = puedeEscribir || puedeEliminar;
  const[expedientes, setExpedientes] = useState([]);
  const[isVisibleModal, setIsVisibleModal] = useState(false);
  const[modalType, setModalType] = useState("REGISTER");
  const[updateData, setUpdateData] = useState(null);
  const[texto, setTexto] = useState("");
  const[filtroEstatus, setFiltroEstatus] = useState("");
  const[filtroPrioridad, setFiltroPrioridad] = useState("");
  const[orden, setOrden] = useState({campo: "", direccion: "asc"});
  const[pagina, setPagina] = useState(1);
  
  const fetchExpedientes = async(textoBusqueda = "") => {
    try {
      const res = textoBusqueda.trim() ? await buscarExpedientes(textoBusqueda) : await getExpedientes();
      const data = await res.json();

      if(!res.ok) {
        console.log("Error: " + data.error);
        return[];
      }

      return data; // el servidor responde directamente con el arreglo de expedientes
    } catch (error) {
      console.log(error);
      return[];
    }
  }

  const cargarExpedientes = async() => {
    setExpedientes(await fetchExpedientes(texto));
  }

  const toggleModal = () => {
    setIsVisibleModal(!isVisibleModal)
  }

const openModal = (type, prevData) => {setModalType(type);
setUpdateData(prevData);
toggleModal();
}

const onSubmitRegister = async (formData) => {

try {
const res = await crearExpediente(formData);
const data = await res.json();

if(!res.ok || !data.success) {
console.log("Error: " + (data.message || data.error));
alert(data.message || "Problemas con el folio");
return;
}

alert("Folio " + data.expediente.folio + " creado con exito");
setIsVisibleModal(false);
await cargarExpedientes();
} catch (error) {
console.log(error);
alert("No se pudo conectar con el servidor");
}
}

const onSubmitUpdate = async (formData) => {
try {
const res = await modificarExpediente(formData);
const data = await res.json();

if(!res.ok) {
console.log("Error: " + (data.message || data.error));
alert(data.message || "Problemas con el folio");
return;
}

alert("Folio modificado con exito");
setIsVisibleModal(false);
await cargarExpedientes();
} catch (error) {
console.log(error)
}

}

const onDelete = async (formData) => {

if(!confirm("¿Desea eliminar el expediente?")) {
return;
}

try {
const res = await eliminarExpediente(formData);
const data = await res.json();

if(!res.ok || !data.success) {
console.log("Error: " + (data.message || data.error));
alert(data.message || "Problemas con el folio");
return;
}

alert("Folio eliminado con exito");
await cargarExpedientes();
} catch (error) {
console.log(error)
}

}

useEffect(() => {
let vigente = true;
const temporizador = setTimeout(() => {
fetchExpedientes(texto).then(expeds => {
if (vigente) setExpedientes(expeds);
});
}, texto ? 300 : 0);

return () => {
vigente = false;
clearTimeout(temporizador);
};
}, [texto])


const cambiarOrden = (campo) => {
setPagina(1)
setOrden(prev => prev.campo === campo
? {campo, direccion: prev.direccion === "asc" ? "desc" : "asc"}
: {campo, direccion: "asc"});
}

const flecha = (campo) => orden.campo === campo ? (orden.direccion === "asc" ? " ▲" : " ▼") : "";

const filtrados = expedientes.filter(e =>
(!filtroEstatus || e.estatus === filtroEstatus) &&
(!filtroPrioridad || e.prioridad === filtroPrioridad)
);

const ordenados = [...filtrados].sort((a, b) => {
if (!orden.campo) return 0;
const va = valorOrden(a, orden.campo);
const vb = valorOrden(b, orden.campo);
let resultado = va < vb ? -1 : va > vb ? 1 : 0;
if (resultado === 0) resultado = valorOrden(a, "folio") - valorOrden(b, "folio");
return orden.direccion === "asc" ? resultado : -resultado;
});

const totalPaginas = Math.max(1, Math.ceil(ordenados.length / POR_PAGINA));
const paginaActual = Math.min(pagina, totalPaginas);
const paginados = ordenados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

return (
<div>
<Link to="/dashboard">← Menú</Link>
{puedeEscribir && <button onClick={() => openModal("REGISTER")}>Registrar nuevo Expediente</button>}
<input
type="search"
placeholder="Buscar por folio, nombre o descripción..."
value={texto}
onChange={(e) => {setTexto(e.target.value); setPagina(1);}}
/>
<div className="filtros">
<label>
Estatus:{" "}
<select value={filtroEstatus} onChange={(e) => {
setFiltroEstatus(e.target.value); 
setPagina(1);
}}>
<option value="">Todos</option>
<option value="Abierto">Abierto</option>
<option value="En proceso">En proceso</option>
<option value="Cerrado">Cerrado</option>
</select>
</label>
<label>
Prioridad:{" "}
<select value={filtroPrioridad} onChange={(e) => {
setFiltroPrioridad(e.target.value); 
setPagina(1);
}}>
<option value="">Todas</option>
<option value="Alta">Alta</option>
<option value="Media">Media</option>
<option value="Baja">Baja</option>
</select>
</label> 
</div>
<table>
<thead>
<tr>
<th className="th-ordenable" onClick={() => cambiarOrden("folio")}>Folio{flecha("folio")}</th>
 <th>Nombre</th>
 <th>Incidente</th>
 <th>Zona</th>
 <th>Estatus</th>
<th className="th-ordenable" onClick={() => cambiarOrden("prioridad")}>Prioridad{flecha("prioridad")}</th>
 <th>Fecha</th>
<th className="th-ordenable" onClick={() => cambiarOrden("fechaCreacion")}>Creación{flecha("fechaCreacion")}</th>
 <th>Modificación</th>
 <th>Descripción</th>
{mostrarOpciones && <th>Opciones</th>}
</tr>
</thead>
<tbody>
{ordenados.length === 0 && (
<tr><td colSpan={mostrarOpciones ? 11 : 10}>No se encontraron expedientes.</td></tr>
)}
{paginados.map((expediente) => (
<tr key={expediente.folio}>
 <td>{expediente.folio}</td>
 <td>{expediente.nombre}</td>
 <td>{expediente.inc}</td>
 <td>{expediente.zona}</td>
<td>
{expediente.estatus
? <span className={"estatus " + (CLASE_ESTATUS[expediente.estatus] ?? "")}>{expediente.estatus}</span>
: "—"}
</td>
<td>{expediente.prioridad ?? "—"}</td>
 <td>{expediente.fecha}</td>
<td>{formatearFecha(expediente.fechaCreacion)}</td>
<td>{formatearFecha(expediente.fechaModificacion)}</td>
<td>{expediente.desc}</td>
{mostrarOpciones && (
 <td>
{puedeEscribir && <button onClick={() => openModal("UPDATE", expediente)}>Modificar</button>}
{puedeEliminar && <button onClick={() => onDelete(expediente)}>Eliminar</button>}
</td>
)}
</tr>
))}
</tbody>
</table>

<div className="paginacion">
<button onClick={() => setPagina(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
<span>Página {paginaActual} de {totalPaginas}</span>
<button onClick={() => setPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente</button>
<span>({ordenados.length} expedientes)</span>
</div>

{isVisibleModal && (
<div>
<Modal
onSubmit={modalType === "UPDATE" ? onSubmitUpdate : onSubmitRegister}
type={modalType}
isOpen={isVisibleModal}
onClose={toggleModal}
prevData={updateData}
/>
</div>
)}
</div>
);
}

export default Expedientes;
