import express from "express";
import path from "path";
import cors from "cors";

import {loadBackendMJM} from "./src/back/index-MJM.js";
import {loadBackendFLL} from "./src/back/index-FLL.js";
import {loadBackendGGT} from "./src/back/index-GGT.js";
import { fileURLToPath } from 'url';
import {handler} from './src/front/build/handler.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express();
const PORT = process.env.PORT || 16079;

// Servir archivos estáticos desde la carpeta "public"
//app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.use(cors(
    /*{
        origin: 'http://localhost:5173', // frontend origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }*/
));
// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/about.html"));
});

// Ruta para servir "index.html" en "/"
/*
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
*/

loadBackendMJM(app);
loadBackendFLL(app);
loadBackendGGT(app);


app.use(handler)


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
