// express is lightweight web framework
import express from 'express'
// We will use this to make HTTP request to the mp3 link
import axios from 'axios'

import * as url from 'url';

import fs from 'fs'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const { httpAdapter } = axios;
// Initialize express and assign to variable app
const app = express();

app.use(express.static('.'));

app.get('/', (req, res) => {

    
    res.sendFile(__dirname+'index.html');
})

app.get('/dialogue/:letter/:number', (req, res) => {

    var letter = req.params.letter;
    var number = req.params.number < 10 && req.params.number[0] !== "0" ? '0'+req.params.number : req.params.number;

    let rawdata = fs.readFileSync('./dialogues/'+letter+'/'+letter+'_'+number+'.json');
    let data = JSON.parse(rawdata);

    console.log(data);

    res.json(data);
})

app.get("/audio/:cod", (req, res) => {

    var audioInput = "http://localhost:3030/mp3/A/01/"+req.params.cod+".mp3";

    axios
      .get(audioInput, {
        responseType: "stream",
        adapter: httpAdapter,
        "Content-Range": "bytes 16561-8065611",
      })
      .then((Response) => {
        const stream = Response.data;
  
        res.set("content-type", "audio/mp3");
        res.set("accept-ranges", "bytes");
        res.set("content-length", Response.headers["content-length"]);
  
        stream.on("data", (chunk) => {
          res.write(chunk);
        });
  
        stream.on("error", (err) => {
          res.sendStatus(404);
        });
  
        stream.on("end", () => {
          res.end();
        });
      })
      .catch((Err) => {
        console.log(Err.message);
      });
  });
  
app.listen(3030, function() {
    console.log('Servidor rodando.')
})