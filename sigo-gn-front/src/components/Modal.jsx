
import{useState, useRef, useEffect } from 'react';

import '../styles/modal.css';

function Modal({onSubmit, type = 'UPDATE', onClose, isOpen, prevData}) {
  const modalRef = useRef(null);
  const[data, setData] = useState({
    folio: prevData ? prevData.folio: "",
    nombre: prevData ? prevData.nombre: "",
    inc: prevData ? prevData.inc: "",
    zona: prevData ? prevData.zona: "",
    fecha: prevData ? prevData.fecha: "",
    desc: prevData ? prevData.desc: ""
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown",handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose])

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({...data, [name]: value});
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(data);
  }
  
  if(!isOpen) return null;
  
  return(
    <div className="modal-blur">
      <form onSubmit={handleSubmit} className="modal-form" ref={modalRef}>
        {type === "UPDATE" ? (<h2>Modificar Folio</h2>):(<h2>Crear Folio</h2>)}
        <label>
          <p>Ingrese el nombre del operativo:</p>
          <input
            type="text"
            name="nombre"
            onChange={handleChange}
            value={data.nombre}
            placeholder="EJ. Operativo 1"
          required/>
        </label>

        <label>
          <p>Ingrese el tipo del operativo:</p>
          <input
            type="text"
            name="inc"
            onChange={handleChange}
            value={data.inc}
            placeholder="EJ. Incidente 1"
          required/>
        </label>

        <label>
          <p>Ingrese la zona del operativo:</p>
          <input
            type="text"
            name="zona"
            onChange={handleChange}
            value={data.zona}
            placeholder="EJ. Norte"
          required/>
        </label>

        <label>
          <p>Ingrese la fecha del operativo:</p>
          <input
            type="text"
            name="fecha"
            onChange={handleChange}
            value={data.fecha}
          required/>
        </label>

        <label>
          <p>Ingrese la descripcion del operativo:</p>
          <input
            type="text"
            name="desc"
            onChange={handleChange}
            value={data.desc}
            placeholder="El incidente fue..."
          optional/>
        </label>

        <label>
          <button type="submit">Enviar datos</button>
        </label>
      </form>
    </div>
  )
}

export default Modal;
