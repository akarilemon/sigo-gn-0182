import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
const app = express();
const port = 4000;

const folder = './data/expedientes/'; //path paera acceder a folios y evitar redundancia gg

const ESTATUS = ['Abierto', 'En proceso', 'Cerrado'];
const PRIORIDADES = ['Alta', 'Media', 'Baja'];

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const leerExpedientes = async () => {
  const files = await fs.readdir(folder);
  const result = [];

  for (const file of files) {
    if(file.endsWith('.json')) {
      const filePath = path.join(folder, file);
      const data = await fs.readFile(filePath, 'utf8');
      result.push(JSON.parse(data));
    }
  }

  return result;
};
 
app.get('/expedientes', async (req, res) => {
  try {
    res.status(200).json(await leerExpedientes());
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message});
  }
});
 
app.get('/expedientes/buscar', async (req, res) => {
  try {
    const texto = String(req.query.texto ?? '').trim().toLowerCase();
    const expedientes = await leerExpedientes();

    if (!texto) {
      return res.status(200).json(expedientes);
    }

    const resultado = expedientes.filter((exp) => {
      const folio = String(exp.folio ?? '').toLowerCase();
      const folioCompleto = `exp-0182-${folio}`;
      const nombre = String(exp.nombre ?? '').toLowerCase();
      const desc = String(exp.desc ?? '').toLowerCase();
      return folioCompleto.includes(texto) || nombre.includes(texto) || desc.includes(texto);
    });

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message});
  }
});

app.get('/expedientes', async (req, res) => {
  try {
    const files = await fs.readdir(folder);
    const result = [];

    for (const file of files) {
      if(file.endsWith('.json')) {
        const filePath = path.join(folder, file);
        const data = await fs.readFile(filePath, 'utf8');
        result.push(JSON.parse(data));
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: error.message});
  }
}); //se accede a todos los folios y se parsean en json

const siguienteFolio = async () => {
  await fs.mkdir(folder, {recursive: true});
  const files = await fs.readdir(folder);
  let max = 0;
  for (const file of files) {
    const match = file.match(/^EXP-0182-(\d+)\.json$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return max + 1;
};
 
app.post('/expedientes', async (req, res) => {
  try {
    const {nombre, inc, zona, fecha, desc} = req.body;
    const estatus = req.body.estatus ?? 'Abierto';
    const prioridad = req.body.prioridad ?? 'Media';
    if (!ESTATUS.includes(estatus) || !PRIORIDADES.includes(prioridad)) {
      return res.status(400).json({success: false, message: "Estatus o prioridad invalidos."});
    }
   
    const ahora = new Date().toISOString();
    let numero = await siguienteFolio();
 
    for (let intento = 0; intento < 10; intento++, numero++) {
      const folio = String(numero);
      const data = {folio, nombre, inc, zona, fecha, desc, estatus, prioridad, fechaCreacion: ahora, fechaModificacion: ahora};
      const fileName = path.join(folder, `EXP-0182-${folio}.json`);
      try {
        await fs.writeFile(fileName, JSON.stringify(data, null, 2), {encoding: 'utf8', flag: 'wx'});
        return res.status(201).json({success: true, expediente: data});
      } catch (e) {
        if (e.code !== 'EEXIST') throw e;
      }
    }
    return res.status(409).json({success: false, message: "No se pudo asignar un folio, intente de nuevo."});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, error: error.message});
  }
});
app.get('/expedientes/:folio', async (req ,res) => {
  try {
    const {folio} = req.params;
    const fileName = path.join(folder, `EXP-0182-${folio}.json`);

    const data = await fs.readFile(fileName, 'utf8');
    res.status(200).json(JSON.parse(data));
  }  catch (err) {
    res.status(404).json({success: false, message: "El folio no existe."});
  }
}); 

app.put('/expedientes/:folio', async (req, res) => {
  try {
    const {folio} = req.params;
    const {nombre, inc, zona, fecha, desc} = req.body;
    if (!nombre && !inc && !zona) {
      return res.status(400).json({ success: false, message: "El cuerpo de la petición (body) está vacío o incompleto." });
    }

    const fileName = path.join(folder, `EXP-0182-${folio}.json`);

    let actual;
    try {
      actual = JSON.parse(await fs.readFile(fileName, 'utf8'));
    } catch (e) {
      return res.status(404).json({success: false, message: "El folio no existe."});
    }

    const estatus = req.body.estatus ?? actual.estatus ?? 'Abierto';
    const prioridad = req.body.prioridad ?? actual.prioridad ?? 'Media';
    if (!ESTATUS.includes(estatus) || !PRIORIDADES.includes(prioridad)) {
      return res.status(400).json({success: false, message: "Estatus o prioridad invalidos."});
    }

    const data = {
      folio,
      nombre,
      inc,
      zona,
      fecha,
      desc,
      estatus,
      prioridad,
      fechaCreacion: actual.fechaCreacion,
      fechaModificacion: new Date().toISOString()
    };
    
    console.log(path.resolve(fileName)); 
    
    await fs.writeFile(fileName, JSON.stringify(data, null, 2), {encoding: 'utf8'});
    return res.status(200).json(data);
  } catch (err) {console.log(err.message); res.status(500).json({error: err.message});}
});

app.delete('/expedientes/:folio', async (req, res) => {
  try {
    const {folio} = req.params;
    const fileName = path.join(folder, `EXP-0182-${folio}.json`);
    await fs.unlink(fileName);
    res.status(200).json({success: true, message: "Archivo eliminado con exito."});
  } catch (err) {
    res.status(404).json({success: false, message: "El archivo no existe o no pudo ser eliminado."});
  }
}); 

app.listen(port, () => {
  console.log("Servidor activo.\nPuerto: 4000");
});

