import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
const app = express();
const port = 4000;

const folder = './data/expedientes/'; //path paera acceder a folios y evitar redundancia gg

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

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

app.post('/expedientes', async (req, res) => {
  try {
    const {folio, nombre, inc, zona, fecha, desc} = req.body;

    const data = {
      folio, 
      nombre, 
      inc, 
      zona, 
      fecha, 
      desc
    };

   // if (folio == undefined) {res.status(404).json({success:false, message: "Folio sin determinar."});}
    const fileName = path.join(folder, `EXP-0182-${folio}.json`);
    try {
      await fs.stat(fileName);
      res.status(400).json({success: false, message: "Archivo ya existe."});
    } catch (e) {
      await fs.writeFile(fileName, JSON.stringify(data,null,2), {encoding: 'utf8'});
      res.status(200).json(data);
    }
    } catch (error) {console.log(error.message); res.status(500).json({error: error.message});}
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
    const data = {
      folio,
      nombre,
      inc,
      zona,
      fecha,
      desc
    };
    
    const fileName = path.join(folder, `EXP-0182-${folio}.json`);
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

