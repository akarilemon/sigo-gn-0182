import express from 'express';
import cors from 'cors';
import fs from 'fs';
const app = express();
const port = 4000;

const folder = './data/expedientes/'; //path paera acceder a folios y evitar redundancia gg

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/data/expedientes', (req, res) => {
  fs.readdirSync(folder).forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err;
      res.status(200).json(JSON.parse(data));
    });
    console.log(file);
  });
}); //se accede a todos los folios y se parsean en json

app.post('data/expedientes', async (req, res) => {
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
      
      const fileName = folder + `EXP-0182-${folio}.json`;
      await fs.writeFile(fileName, JSON.stringify(fileContents, null, 2), {encoding: 'utf8'});
      console.log(data);
      res.status(200).json({success: true});
    } catch (err) {console.log(err.message); res.status(500).json({error: error.message});}
});

app.get('data/expedientes/:folio', (req ,res) => {
  const {folio} = req.params;

  const fileName = `EXP-0182-${folio}.json`;
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) res.status(404).json({success: false, message: "El folio no existe."});
    res.status(200).json(JSON.parse(data));
  });
}); 

app.put('data/expedientes/:folio', async (req, res) => {
  try {
    const {folio} = req.params;
    const {nombre, inc, zona, fecha, desc} = req.body;
    const data = {
      folio,
      nombre,
      inc,
      zona,
      fecha,
      desc
    };
    
    fileName = folder + `EXP-0182-${folio}.json`;
    
    if(await !fs.existsSync(fileName)) 
      return res.status(400).json({success: false, message: "Archivo no existe."});
    
    await fs.writeFile(fileName, JSON.stringify(data,null,2), {encoding: 'utf8'}); 
    res.status(200).json(JSON.parse(data));
  } catch (err) {console.log(err.message); res.status(500).json({error: error.message});}
});

app.delete('data/expedientes/:folio', (req, res) => {
  fs.unlinkSync(folder);
 
  if (err) 
    res.status(404).json({success: false, message: "El archivo no existe o no pudo ser eliminado."});
  else res.status(200);
}); 

app.listen(port, () => {
  console.log("Servidor activo.\nPuerto: 4000");
});

