import {useEffect, useState} from "react";
import Modal from "../components/Modal";

import {getExpedientes, crearExpediente, modificarExpediente, eliminarExpediente} from "../api/api.js";

const formatearFecha = (iso) => iso ? new Date(iso).toLocaleString("es-MX") : "—";

function Expedientes() {
  const[expedientes, setExpedientes] = useState([]);
  const[isVisibleModal, setIsVisibleModal] = useState(false);
  const[modalType, setModalType] = useState("REGISTER");
  const[updateData, setUpdateData] = useState(null);

  const fetchExpedientes = async() => {
    try {
      const res = await getExpedientes();
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
    setExpedientes(await fetchExpedientes());
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
fetchExpedientes().then(expeds => {
setExpedientes(expeds);
});
}, [])


// folio, nombre, incidente, zona, fecha, descripcion
return (
<div>
<button onClick={() => openModal("REGISTER")}>Registrar nuevo Expediente</button>
<table>
<thead>
<tr>
<th>Folio</th>
<th>Nombre</th>
<th>Incidente</th>
<th>Zona</th>
<th>Estatus</th>
<th>Prioridad</th>
<th>Fecha</th>
<th>Creación</th>
<th>Modificación</th>
<th>Descripción</th>
<th>Opciones</th>
</tr>
</thead>
<tbody>
{expedientes?.map((expediente, i) => (
<tr key={i}>
<td>{expediente.folio}</td>
<td>{expediente.nombre}</td>
<td>{expediente.inc}</td>
<td>{expediente.zona}</td>
<td>{expediente.estatus ?? "—"}</td>
<td>{expediente.prioridad ?? "—"}</td>
 <td>{expediente.fecha}</td>
<td>{formatearFecha(expediente.fechaCreacion)}</td>
<td>{formatearFecha(expediente.fechaModificacion)}</td>
<td>{expediente.desc}</td>
<td>
<button onClick={() => openModal("UPDATE", expediente)}>Modificar</button>
<button onClick={() => onDelete(expediente)}>Eliminar</button>
</td>
</tr>
))}
</tbody>
</table>

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
