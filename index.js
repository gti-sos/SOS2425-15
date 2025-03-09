const express = require("express"); 
const path = require("path");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;


// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", (req, res) => {
    res.send(`
        <h1>Bienvenido a la API del Grupo 15</h1>
       
    `);
});
// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/about.html"));
});

// Ruta para "/cool"
app.get("/cool", (req, res) => {
    res.send(cool());
});

// Nueva ruta "/samples/DLC" para ejecutar el algoritmo y devolver el resultado
/*app.get("/samples/FLL", (req, res) => {
    let ress = calculatePointsDeducted()    
        res.send(`<h1>Resultado del cálculo</h1><p>${ress.toFixed(2)}</p>`);
});

// Nueva ruta "samples/JVF" para ejecutar el algoritmo y devolver el resultado 
app.get("/samples/GGT", (req,res) => {
    let respond=CalculateChanges()
        res.send(`<h1>Resultado del cálculo</h1>${respond}<p></p>`);
});*/
//Parte Manuel
const datosM = require("./index-MJM.js");

app.get("/samples/MJM", (req,res) => {
    let resultado = "<h2> MEDIA ACUMULACIONES</h2>";
    resultado += media_Acumulaciones(datosM);
    res.send(`<h1>Resultado del cálculo</h1>${resultado}<p></p>`)
    });

    


function media_Acumulaciones(ejemplos){
    conteo= 0;
    sumaPrecipitaciones = 0;
    ejemplos.forEach(x => {
        sumaPrecipitaciones += parseFloat(x.annual_precipitation);
        conteo += 1;
    });
    return sumaPrecipitaciones/conteo;
}



//Parte Fernando
const datosF = require("./index-FLL.js");

app.get("/samples/FLL", (req,res) => {
    let resultado = "<h2> MEDIA Ground</h2>";
    resultado += media_Ground(datosF);
    res.send(`<h1>Resultado del cálculo</h1>${resultado}<p></p>`)
    });

    

function media_Ground(datos) {
    let sumaGround = 0;
    let cantidad = 0;
    
    datos.forEach(element => {
        sumaGround += element.ground;
        cantidad += 1;
    });
    
    return sumaGround / cantidad;
}




// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});