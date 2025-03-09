const express = require("express"); 
const path = require("path");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;
const calculatePointsDeducted = require("./js/index-FLL"); // Importamos la función corregida
const CalculateChanges = require("./js/index-GGT");
const calculateDeceased = require("./js/index-MJM");
const mediaAcumulaciones = require("./js/index-MJM");


// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "/public")));

// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/about.html"));
});

// Ruta para "/cool"
app.get("/cool", (req, res) => {
    res.send(cool());
});

// Nueva ruta "/samples/DLC" para ejecutar el algoritmo y devolver el resultado
app.get("/samples/FLL", (req, res) => {
    let ress = calculatePointsDeducted()    
        res.send(`<h1>Resultado del cálculo</h1><p>${ress.toFixed(2)}</p>`);
});

// Nueva ruta "samples/JVF" para ejecutar el algoritmo y devolver el resultado 
app.get("/samples/GGT", (req,res) => {
    let respond=CalculateChanges()
        res.send(`<h1>Resultado del cálculo</h1>${respond}<p></p>`);
});

app.get("/samples/MJM", (req,res) => {
    let resp=mediaAcumulaciones() 
        res.send(`<h1>Resultado del calculo</h1><p>${resp}</p>`);
    
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});