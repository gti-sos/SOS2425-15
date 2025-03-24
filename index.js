const express = require("express"); 
const path = require("path");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;
const BASE_API = "/api/v1"


// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());



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



app.get(BASE_API + "/ocupied-grand-stats" + "/:province" , (request, response) => {
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


app.get(BASE_API + "/ocupied-grand-stats", (req, res) => {
    let datosFiltrados = ocupied_grand_stats;
    let { from, to, year, province } = req.query;

    // Filtrar por rango de años (from y to)
    if (from !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year >= Number(from));
    }
    if (to !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year <= Number(to));
    }

    // Filtrar por un año específico
    if (year !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year === Number(year));
    }

    // Filtrar por provincia (sin importar mayúsculas/minúsculas ni espacios)
    if (province !== undefined) {
        const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");
        datosFiltrados = datosFiltrados.filter(stat => normalizeProvince(stat.province) === normalizeProvince(province));
    }

    return res.status(200).json(datosFiltrados);
});
// Obtener registros por año y provincia
app.get(BASE_API + "/ocupied-grand-stats/:province/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province.toLowerCase();

    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    const data = ocupied_grand_stats.filter(x =>
        x.year === year && normalizeProvince(x.province) === normalizeProvince(province)
    );

    if (data.length === 0) {
        return res.status(404).json({ error: "No data found for the given year and province" });
    }
    res.status(200).json(data);
});

// Cargar datos iniciales
app.get(BASE_API + "/ocupied-grand-stats/loadInitialData", (req, res) => {
    if (ocupied_grand_stats.length === 0) {
        ocupied_grand_stats.push(...ocupied_grand_stats.slice(0, 10));
        return res.status(201).json({ message: "Initial data loaded", data: ocupied_grand_stats });
    }
    res.status(200).json({ message: "Data already initialized", data: ocupied_grand_stats});
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

// Modificar un registro existente
app.put(BASE_API + "/ocupied-grand-stats/:province/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = ocupied_grand_stats.findIndex(x => x.year === year && x.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    if (req.body.year !== year || req.body.province !== province) {
        return res.status(400).json({ error: "Year and province in body must match URL parameters" });
    }
    ocupied_grand_stats[index] = { ...ocupied_grand_stats[index], ...req.body };
    res.status(200).json({ message: "Record updated successfully" });
});
//FALLO DE PUT a todos los datos
app.put(BASE_API + "/ocupied-grand-stats/",(req,res)=>{    
    
    res.sendStatus(405);
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


//Parte Manuel

//Parte Manuel
let precipitation_stats = [];

//loadInitialData
app.get(BASE_API + "/precipitation-stats/loadInitialData", (request, response) => {
    console.log("New GET to /loadInitialData");
    if (precipitation_stats.length > 0) {
        return response.status(400).json({ message: "El array ya contiene datos " });
    }
    else{

        precipitation_stats = [
            { year: 2020, province: "Sevilla", annual_precipitation: 210.6, historical_average: 292.9, deviation: -82.4 },
            { year: 2020, province: "Cádiz", annual_precipitation: 578.6, historical_average: 722.9, deviation: -144.3 },
            { year: 2020, province: "Córdoba", annual_precipitation: 450.2, historical_average: 557.9, deviation: -107.7 },
            { year: 2020, province: "Granada", annual_precipitation: 344.5, historical_average: 430.5, deviation: -86 },
            { year: 2020, province: "Huelva", annual_precipitation: 617.5, historical_average: 644.6, deviation: -27.1 },
            { year: 2020, province: "Jaén", annual_precipitation: 411.3, historical_average: 549.4, deviation: -138 },
            { year: 2020, province: "Almería", annual_precipitation: 210.6, historical_average: 292.9, deviation: -82.4 },
            { year: 2020, province: "Sevilla", annual_precipitation: 472, historical_average: 559.7, deviation: -87.7 },
            { year: 2021, province: "Sevilla", annual_precipitation: 440.7, historical_average: 559.7, deviation: -119 },
            { year: 2022, province: "Sevilla", annual_precipitation: 451.8, historical_average: 559.7, deviation: -107.9 },
            { year: 2021, province: "Cádiz", annual_precipitation: 568.5, historical_average: 722.9, deviation: -154.3 },
            { year: 2021, province: "Córdoba", annual_precipitation: 433.4, historical_average: 557.9, deviation: -124.5 },
            { year: 2021, province: "Granada", annual_precipitation: 309, historical_average: 430.5, deviation: -121.5 },
            { year: 2021, province: "Huelva", annual_precipitation: 484, historical_average: 644.6, deviation: -160.6 },
            { year: 2021, province: "Jaén", annual_precipitation: 432.3, historical_average: 549.4, deviation: -117.1 },
            { year: 2022, province: "Málaga", annual_precipitation: 580.4, historical_average: 628.4, deviation: -47.9 },
            { year: 2022, province: "Cádiz", annual_precipitation: 639.2, historical_average: 722.9, deviation: -83.7 },
            { year: 2022, province: "Córdoba", annual_precipitation: 441.2, historical_average: 557.9, deviation: -116.7 },
            { year: 2022, province: "Granada", annual_precipitation: 372.7, historical_average: 430.5, deviation: -57.8 }    
        ];
        console.log(precipitation_stats);

        response.status(201).json(precipitation_stats);
    }
});

//GET
/*app.get(BASE_API + "/precipitation-stats", (request, response) => {
    console.log("New GET to /precipitation-stats");
    response.send(JSON.stringify(precipitation_stats));
});*/


app.get(BASE_API + "/precipitation-stats" + "/:province" , (request, response) => {
    const province = request.params.province;
    console.log(`New GET to /precipitation-stats/${province}`);

    const search = precipitation_stats.filter(x => x.province === province);
    if (search.length > 0){
        return response.status(200).json(search);
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }
});

/*app.get(BASE_API + "/precipitation-stats"+ "/:province" + "/:year" , (request, response) => {
    const province = request.params.province;
    const year = request.params.year;
    console.log(`New GET to /precipitation-stats/${province}/${year}`);

    const search = precipitation_stats.filter(x => x.province === province && x.year == year);
    if (search.length > 0){
        return response.status(200).json(search);
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province} en ${year}`});
    }
});*/
app.get(BASE_API + "/precipitation-stats", (req, res) => {
    let datosFiltrados = precipitation_stats;
    let { from, to, year, province } = req.query;

    // Filtrar por rango de años (from y to)
    if (from !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year >= Number(from));
    }
    if (to !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year <= Number(to));
    }

    // Filtrar por un año específico
    if (year !== undefined) {
        datosFiltrados = datosFiltrados.filter(stat => stat.year === Number(year));
    }

    // Filtrar por provincia (sin importar mayúsculas/minúsculas ni espacios)
    if (province !== undefined) {
        const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");
        datosFiltrados = datosFiltrados.filter(stat => normalizeProvince(stat.province) === normalizeProvince(province));
    }

    return res.status(200).json(datosFiltrados);
});
// Obtener registros por año y provincia
app.get(BASE_API + "/precipitation-stats/:province/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province.toLowerCase();

    const normalizeProvince = (p) => p.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    const data = precipitation_stats.filter(x =>
        x.year === year && normalizeProvince(x.province) === normalizeProvince(province)
    );

    if (data.length === 0) {
        return res.status(404).json({ error: "No data found for the given year and province" });
    }
    res.status(200).json(data);
});

// Cargar datos iniciales
app.get(BASE_API + "/precipitation-stats/loadInitialData", (req, res) => {
    if (precipitation_stats.length === 0) {
        precipitation_stats.push(...precipitation_stats.slice(0, 10));
        return res.status(201).json({ message: "Initial data loaded", data: precipitation_stats });
    }
    res.status(200).json({ message: "Data already initialized", data: precipitation_stats});
});
//POST
app.post(BASE_API + "/precipitation-stats", (request, response) => {
    console.log("New POST to /precipitation-stats");
    let newData = request.body;
    if (precipitation_stats.some(x =>  x.year === newData.year && x.province === newData.province && x.annual_precipitation === newData.annual_precipitation)){
        return response.status(409).json({ error: "Ya existe ese dato" });
    }
    else{
        if (!newData.year || !newData.province || !newData.annual_precipitation || !newData.historical_average || !newData.deviation) {
            return response.status(400).json({ error: "Faltan datos requeridos" });
        }
        else{
            precipitation_stats.push(newData);
            response.sendStatus(201);
        }
    }
});


app.post(BASE_API + "/precipitation-stats/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New POST to /precipitation-stats/${province}`);
    response.status(405).json({error : "Método POST no permitido"});
});


//PUT
/*app.put(BASE_API + "/precipitation-stats", (request, response) => {
    console.log("New PUT to /precipitation-stats");
    response.status(405).json({error : "Método PUT no permitido"});
});


app.put(BASE_API + "/precipitation-stats/:province/:year/", (request, response) => {
    let province = request.params.province;
    let year = request.params.year;
    console.log(`New PUT to /precipitation-stats/${province}/${year}`);

    const index = precipitation_stats.findIndex(x => x.province == province && x.year == year);
    if (index >= 0){
        let data = request.body;
        precipitation_stats[index] = {
            ...precipitation_stats[index], // mantiene los datos actuales
            ...data                      // sobrescribe solo los campos enviados
        };
        response.status(200).json({message : "Datos actualizados"});
        
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province} en ${year}`});
    }

});*/
// Modificar un registro existente
app.put(BASE_API + "/precipitation-stats/:province/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const index = precipitation_stats.findIndex(x => x.year === year && x.province === province);
    if (index === -1) return res.status(404).json({ error: "Record not found" });
    if (req.body.year !== year || req.body.province !== province) {
        return res.status(400).json({ error: "Year and province in body must match URL parameters" });
    }
    precipitation_stats[index] = { ...precipitation_stats[index], ...req.body };
    res.status(200).json({ message: "Record updated successfully" });
});
//FALLO DE PUT a todos los datos
app.put(BASE_API + "/precipitation-stats/",(req,res)=>{    
    
    res.sendStatus(405);
});

//DELETE
app.delete(BASE_API + "/precipitation-stats", (request, response) => {
    console.log("New DELETE to /precipitation-stats");
    precipitation_stats = [];
    response.status(200).json(precipitation_stats);
});


app.delete(BASE_API + "/precipitation-stats" + "/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New GET to /precipitation-stats/${province}`);

    const exists = precipitation_stats.some(x => x.province === province);
    if (exists){
        precipitation_stats = precipitation_stats.filter(x => x.province !== province);
        return response.status(200).json(precipitation_stats);
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }
});

//Parte Gonzalo
let temperature_stats = [];

//loadInitialData
app.get(BASE_API + "/temperature-stats/loadInitialData", (request, response) => {
    console.log("New GET to /loadInitialData");
    if (temperature_stats.length > 0) {
        return response.status(400).json({ message: "El array ya contiene datos " });
    }
    else{

        temperature_stats = [
            {year: "2020", province: "Almería", average_temperature: "16.2", minimum_average: "11.2", maximum_average: "21.9"},
            {year: "2020", province: "Cádiz", average_temperature: "18.0", minimum_average: "13.1", maximum_average: "23.6"},
            {year: "2020", province: "Córdoba", average_temperature: "17.3", minimum_average: "11.0", maximum_average: "23.9"},
            {year: "2020", province: "Granada", average_temperature: "14.5", minimum_average: "8.7", maximum_average: "20.9"},
            {year: "2020", province: "Huelva", average_temperature: "17.9", minimum_average: "12.1", maximum_average: "24.1"},
            {year: "2020", province: "Jaén", average_temperature: "16.3", minimum_average: "10.3", maximum_average: "22.9"},
            {year: "2020", province: "Málaga", average_temperature: "17.0", minimum_average: "12.2", maximum_average: "22.4"},
            {year: "2020", province: "Sevilla", average_temperature: "18.2", minimum_average: "12.1", maximum_average: "24.8"},
            {year: "2021", province: "Almería", average_temperature: "16.1", minimum_average: "11.2", maximum_average: "21.6"},
            {year: "2021", province: "Cádiz", average_temperature: "17.8", minimum_average: "13.0", maximum_average: "23.2"},
            {year: "2021", province: "Córdoba", average_temperature: "17.0", minimum_average: "10.6", maximum_average: "23.7"},
            {year: "2021", province: "Granada", average_temperature: "14.2", minimum_average: "8.4", maximum_average: "20.4"},
            {year: "2021", province: "Huelva", average_temperature: "17.5", minimum_average: "11.6", maximum_average: "23.9"},
            {year: "2021", province: "Jaén", average_temperature: "16.1", minimum_average: "9.9", maximum_average: "22.5"},
            {year: "2021", province: "Málaga", average_temperature: "17.1", minimum_average: "12.2", maximum_average: "22.4"},
            {year: "2021", province: "Sevilla", average_temperature: "18.0", minimum_average: "11.8", maximum_average: "24.7"},
            {year: "2022", province: "Almería", average_temperature: "16.9", minimum_average: "11.7", maximum_average: "22.6"},
            {year: "2022", province: "Cádiz", average_temperature: "18.7", minimum_average: "13.7", maximum_average: "24.2"},
            {year: "2022", province: "Córdoba", average_temperature: "18.0", minimum_average: "11.3", maximum_average: "24.8"},
            {year: "2022", province: "Granada", average_temperature: "15.4", minimum_average: "9.4", maximum_average: "21.9"},
            {year: "2022", province: "Huelva", average_temperature: "18.3", minimum_average: "12.3", maximum_average: "24.8"},
            {year: "2022", province: "Jaén", average_temperature: "17.1", minimum_average: "10.9", maximum_average: "23.7"},
            {year: "2022", province: "Málaga", average_temperature: "17.9", minimum_average: "13.0", maximum_average: "23.3"},
            {year: "2022", province: "Sevilla", average_temperature: "18.7", minimum_average: "12.4", maximum_average: "25.6"},
            {year: "2023", province: "Almería", average_temperature: "17.1", minimum_average: "11.7", maximum_average: "23.0"},
            {year: "2023", province: "Cádiz", average_temperature: "18.6", minimum_average: "13.4", maximum_average: "24.5"},
            {year: "2023", province: "Córdoba", average_temperature: "17.8", minimum_average: "11.0", maximum_average: "24.8"},
            {year: "2023", province: "Granada", average_temperature: "15.3", minimum_average: "9.1", maximum_average: "21.9"},
            {year: "2023", province: "Huelva", average_temperature: "18.5", minimum_average: "12.3", maximum_average: "25.2"},
            {year: "2023", province: "Jaén", average_temperature: "17.0", minimum_average: "10.5", maximum_average: "23.8"},
            {year: "2023", province: "Málaga", average_temperature: "18.0", minimum_average: "12.9", maximum_average: "23.7"},
            {year: "2023", province: "Sevilla", average_temperature: "18.8", minimum_average: "12.1", maximum_average: "25.9"}   
        ];
        console.log(temperature_stats);

        response.status(201).json(temperature_stats);
    }
});

//GET
app.get(BASE_API + "/temperature-stats", (request, response) => {
    console.log("New GET to /temperature-stats");
    response.send(JSON.stringify(temperature_stats));
});


app.get(BASE_API + "/temperature-stats" + "/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New GET to /temperature-stats/${province}`);

    const search = temperature_stats.filter(x => x.province === province);
    if (search.length > 0){
        return response.status(200).json(search);
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }
});

//POST
app.post(BASE_API + "/temperature-stats", (request, response) => {
    console.log("New POST to /temperature-stats");
    let newData = request.body;
    if (temperature_stats.some(x =>  x.year === newData.year && x.province === newData.province && x.average_temperature === newData.average_temperature && x.minimum_average == newData.minimum_average && x.maximum_average == newData.maximum_average)){
        return response.status(409).json({ error: "Ya existe ese dato" });
    }
    else{
        if (!newData.year || !newData.province || !newData.average_temperature || !newData.minimum_average || !newData.maximum_average) {
            return response.status(400).json({ error: "Faltan datos requeridos" });
        }
        else{
            temperature_stats.push(newData);
            response.sendStatus(201);
        }
    }
});


app.post(BASE_API + "/temperature-stats/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New POST to /temperature-stats/${province}`);
    response.status(405).json({error : "Método POST no permitido"});
});


//PUT
app.put(BASE_API + "/temperature-stats", (request, response) => {
    console.log("New PUT to /temperature-stats");
    response.status(405).json({error : "Método PUT no permitido"});
});


app.put(BASE_API + "/temperature-stats/:province", (request, response) => {
    let province = request.params.province;
    console.log(`New PUT to /temperature-stats/${province}`);

    const index = temperature_stats.findIndex(x => x.province == province);
    if (index >= 0){
        let data = request.body;
        temperature_stats[index] = {
            ...temperature_stats[index], // mantiene los datos actuales
            ...data                      // sobrescribe solo los campos enviados
        };
        response.status(200).json({message : "Datos actualizados"});
        
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }

});

//DELETE
app.delete(BASE_API + "/temperature-stats", (request, response) => {
    console.log("New DELETE to /temperature-stats");
    temperature_stats = [];
    response.status(200).json(temperature_stats);
});


app.delete(BASE_API + "/temperature-stats" + "/:province", (request, response) => {
    const province = request.params.province;
    console.log(`New GET to /temperature-stats/${province}`);

    const exists = temperature_stats.some(x => x.province === province);
    if (exists){
        temperature_stats = temperature_stats.filter(x => x.province !== province);
        return response.status(200).json(temperature_stats);
    }
    else{   
        return response.status(404).json({error: `No se encuentran datos de ${province}`});
    }
});
