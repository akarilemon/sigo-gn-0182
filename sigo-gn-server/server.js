import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';
const app = express();
const port = 4000;
const folder = './data/expedientes';

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.get('/data/expedientes', (req, res) => {
  fs.readdirSync(folder).forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err;
      res.send(JSON.parse(data));
    });
    console.log(file);
  });
});

app.post('data/expedientes', (req, res) => {
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

    const addToFile = async data => {
      let fileContents = await fs.readFIle(folio, {encoding: 'utf8'});
      fileContents = JSON.parse(fileContents);
      fileContents.push(data);
      await fs.writeFile(folio, JSON.stringify(fileContents, null, 2), {encoding: 'utf8'});

      data.mv(${folder}${nombre});
    }
  } catch (ex) {console.log(ex);}
});
