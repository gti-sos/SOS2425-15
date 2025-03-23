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



//Parte Gonzalo
const datosG = require("./index-GGT.js");

app.get("/samples/GGT", (req,res) => {
    let resultado = "<h2>Media Total conjunta:</h2>";
    resultado += media_TotalConjunta(datosG);
    res.send(`<h1>Resultado del cálculo</h1>${resultado}<p></p>`)
    });

    


function media_TotalConjunta(datos){
    cantidad = 0;
    sumaTemperaturas = 0;
    datos.forEach(element => {
        sumaTemperaturas += parseFloat(element.average_temperature);
        cantidad += 1;
    });
    return sumaTemperaturas/cantidad;
}


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








//L05 - Fernando Lagares Luna


let ocupied_grand_stats = [];

//loadInitialData
app.get(BASE_API + "/ocupied-grand-stats/loadInitialData", (request, response) => {
    console.log("New GET to /loadInitialData");
    if (ocupied_grand_stats.length > 0) {
        return response.status(400).json({ message: "El array ya contiene datos " });
    }
    else{

        ocupied_grand_stats = [
            {year: "2021", province: "cadiz", ground: 177000, grass: 300000, wooded: 250000, non_agrarian_surface: 70000},
            {year: "2021", province: "almería", ground: 177590, grass: 363915, wooded: 257241, non_agrarian_surface: 78557},
            {year: "2021", province: "cordoba", ground: 728625, grass: 161589, wooded: 391269, non_agrarian_surface: 95577},
            {year: "2020", province: "granada", ground: 534974, grass: 158569, wooded: 490865, non_agrarian_surface: 80282},
            {year: "2019", province: "cadiz", ground: 287411, grass: 113120, wooded: 240573, non_agrarian_surface: 102517},
            {year: "2018", province: "jaén", ground: 651284, grass: 141269, wooded: 482836, non_agrarian_surface: 74220},
            {year: "2020", province: "sevilla", ground: 806241, grass: 137214, wooded: 313296, non_agrarian_surface: 146857},
            {year: "2021", province: "cadiz", ground: 285947, grass: 119568, wooded: 235314, non_agrarian_surface: 103006},
            {year: "2021", province: "caceres", ground: 397184, grass: 335124, wooded: 306463, non_agrarian_surface: 483914},
            {year: "2018", province: "cadiz", ground: 292937, grass: 109096, wooded: 239226, non_agrarian_surface: 102365}
        ];
        console.log(ocupied_grand_stats);

        response.status(201).json(ocupied_grand_stats);
    }
});







//GET
app.get(BASE_API + "/ocupied-grand-stats", (request, response) => {
    console.log("New GET to /ocupied-grand-stats");
    response.send(JSON.stringify(ocupied_grand_stats));
});


app.get(BASE_API + "/ocupied-grand-stats" + "/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New GET to /ocupied-grand-stats/${province}`);

    const search = ocupied_grand_stats.filter(x => x.province === province);
    if (search.length > 0){
        return response.status(200).json(search);
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }
});






//POST
app.post(BASE_API + "/ocupied-grand-stats", (request, response) => {
    console.log("New POST to /ocupied-grand-stats");
    let newData = request.body;
    if (ocupied_grand_stats.some(x =>  x.year === newData.year && x.province === newData.province && x.ground === newData.ground)){
        return response.status(409).json({ error: "Ya existe ese dato" });
    }
    else{
        if (!newData.year || !newData.province || !newData.ground || !newData.wooded || !newData.non_agrarian_surface) {
            return response.status(400).json({ error: "Faltan datos requeridos" });
        }
        else{
            ocupied_grand_stats.push(newData);
            response.sendStatus(201);
        }
    }
});


app.post(BASE_API + "/ocupied-grand-stats/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New POST to /ocupied-grand-stats/${province}`);
    response.status(405).json({error : "Método POST no permitido"});
});







//PUT
app.put(BASE_API + "/ocupied-grand-stats", (request, response) => {
    console.log("New PUT to /ocupied-grand-stats");
    response.status(405).json({error : "Método PUT no permitido"});
});


app.put(BASE_API + "/ocupied-grand-stats/:province", (request, response) => {
    let province = request.params.province;
    console.log(`New PUT to /ocupied-grand-stats/${province}`);

    const index = ocupied_grand_stats.findIndex(x => x.province == province);
    if (index >= 0){
        let data = request.body;
        ocupied_grand_stats[index] = {
            ...ocupied_grand_stats[index], // mantiene los datos actuales
            ...data                      // sobrescribe solo los campos enviados
        };
        response.status(200).json({message : "Datos actualizados"});
        
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }

});






//DELETE
app.delete(BASE_API + "/ocupied-grand-stats", (request, response) => {
    console.log("New DELETE to /ocupied-grand-stats");
    ocupied_grand_stats = [];
    response.status(200).json(ocupied_grand_stats);
});


app.delete(BASE_API + "/ocupied-grand-stats" + "/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New GET to /ocupied-grand-stats/${province}`);

    const exists = ocupied_grand_stats.some(x => x.province === province);
    if (exists){
        ocupied_grand_stats = ocupied_grand_stats.filter(x => x.province !== province);
        return response.status(200).json(ocupied_grand_stats);
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }
});
