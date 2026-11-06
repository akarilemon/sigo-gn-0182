export const PERMISOS = {
  LEER: 4,
  ESCRIBIR: 2,
  ELIMINAR: 1
};

export const ROLES = {
  Comandante: 7,
  Oficial: 6,
  Analista: 4
};

export const aSimbolico = (octal) =>
  ((octal & PERMISOS.LEER) ? "r" : "-") +
  ((octal & PERMISOS.ESCRIBIR) ? "w" : "-") +
  ((octal & PERMISOS.ELIMINAR) ? "x" : "-");

export const tienePermiso = (rolUsuario, accionRequerida) => {
  const valorOctal = Object.hasOwn(ROLES, rolUsuario) ? ROLES[rolUsuario] : 0;
  return (valorOctal & accionRequerida) === accionRequerida;
};

export const obtenerRol = () => {
  try {
    return JSON.parse(localStorage.getItem("sigoUsuario"))?.rol ?? null;
  } catch {
    return null;
  }
};
