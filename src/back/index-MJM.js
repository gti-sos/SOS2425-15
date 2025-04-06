import dataStore from "nedb";


const database = new dataStore();
let precipitation_stats = [
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

function loadInitialDataMJM(){
    let precipitation_stats = [
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
        
    
    return precipitation_stats
}

const BASE_API = "/api/v1"

database.insert(precipitation_stats, (err, newDocs) => {
    if (err) {
        return res.status(500).send("Error al insertar los datos.");
    }
})

function loadBackendMJM(app){
    
    // APIs de DLC
    app.get(BASE_API + "/precipitation-stats/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42153958/2sAYkLncz8"); 
    });

    app.get(BASE_API + "/precipitation-stats/loadInitialDataMJM", (req, res) => {
        database.count({}, (err, count) => {
            if (err) {
                return res.status(500).send("Error al comprobar la base de datos.");
            }

            if (count > 0) {
                return res.status(400).json({ message: "Ya tiene datos" });
            }

            const initialData = loadInitialDataMJM();
            database.insert(initialData, (err, newDocs) => {
                if (err) {
                    return res.status(500).send("Error al insertar los datos.");
                }

                database.find({}, (err, precipitations) => {
                    if (err) {
                        return res.status(500).send("Error al recuperar los datos.");
                    }
                    res.send(JSON.stringify(precipitations.map((x)=>{
                        delete x._id;
                        return x;
                    }),null,2));
                });
            });
        });
    });

    // GET todos los datos con paginación
app.get(BASE_API + "/precipitation-stats", (req, res) => {
    let {ine_code, year, province, annual_precipitation, historical_average, deviation, from, to, limit, offset} = req.query;

    let query = {};
    
    if (ine_code) {
        query.ine_code = Number(ine_code);
    }

    if (year) {
        query.year = Number(year);
    }
    if (province) {
        query.province = new RegExp("^" + province + "$", "i");
    }
    if (annual_precipitation) {
        query.annual_precipitation = Number(annual_precipitation);
    }
    
    if (historical_average) {
        query.historical_average = Number(historical_average);
    }
    if (deviation) {
        query.deviation = Number(deviation);
    }

    if (from || to) {
        query.year = {};
        if (from) query.year.$gte = Number(from);
        if (to) query.year.$lte = Number(to);
    }

    let q = database.find(query);

    // Aplicar paginación si viene por query
    if (offset !== undefined) {
        q = q.skip(Number(offset));
    }
    if (limit !== undefined) {
        q = q.limit(Number(limit));
    }

    q.exec((err, precipitation_stats) => {
        if (err) {
            return res.status(500).send("Error al acceder a la base de datos.");
        }

        // Eliminar _id de cada objeto
        const sanitized = precipitation_stats.map(({ _id, ...rest }) => rest);

        res.send(JSON.stringify(sanitized));
    });
});


    //POST a todos los datos
    app.post(BASE_API + "/precipitation-stats", (req, res) => {
        const {ine_code, year, province, annual_precipitation, historical_average, deviation} = req.body;
        // Validar campos obligatorios
        if (
            ine_code === undefined || year === undefined || province === undefined || annual_precipitation === undefined ||
            historical_average === undefined || deviation === undefined
        ) {
            return res.sendStatus(400); // Bad Request
        }
        // Comprobar si ya existe un registro con mismo ine_code (puedes añadir year si es clave compuesta)
        database.findOne({ ine_code: ine_code }, (err, existingDoc) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (existingDoc) {
                return res.sendStatus(409); // Conflict
            }
            database.insert(req.body, (err, newDoc) => {
                if (err) {
                    return res.status(500).send("Error al insertar el recurso.");
                }
                res.sendStatus(201); // Created
            });
        });
    });
    

    //FALLO DE PUT a todos los datos
    app.put(BASE_API + "/precipitation-stats/",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //DELETE de todos los datos
    app.delete(BASE_API + "/precipitation-stats", (req, res) => {
        database.remove({},{multi:true}); 
        console.log("Todos los datos han sido eliminados."); // Para ver en consola
        res.sendStatus(200); 
    });

    //GET de un dato especifico
    app.get(BASE_API + "/precipitation-stats/:province", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);
    
        database.findOne({ ine_code: paramIneCode }, (err, precipitations) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (!precipitations) {
                return res.sendStatus(404);
            }
            // Eliminar la propiedad _id antes de enviar
        const { _id, ...precipitationsWithoutId } = precipitations;
        res.status(200).json(precipitationsWithoutId);
        });
    });

//POST para resetear la base de datos a la version original
app.post(BASE_API + "/precipitation-stats/reset", (req, res) => {
    database.remove({}, { multi: true }, (err) => {
        if (err) {
            return res.status(500).send("Error al limpiar la base de datos.");
        }    
        database.insert(precipitation_stats, (err) => {
            if (err) {
                return res.status(500).send("Error al restaurar los datos iniciales.");
            }    
            res.status(200).send("Base de datos restaurada.");
        });
    });
});

    //FALLO DE POST de un dato especifico
    app.post(BASE_API + "/precipitation-stats/:province",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //PUT de un dato especifico
    app.put(BASE_API + "/precipitation-stats/:province", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);
        const updatedData = req.body;

        // Verificar que el ine_code en el body coincida con el de la URL
        if (updatedData.ine_code !== paramIneCode) {
            return res.sendStatus(400); // Bad Request
        }    
        database.update({ ine_code: paramIneCode }, updatedData, {}, (err, numReplaced) => {
            if (err) {
                return res.status(500).send("Error al actualizar el recurso.");
            }
    
            if (numReplaced === 0) {
                return res.sendStatus(404); // No encontrado
            }
    
            res.sendStatus(200); // OK
        });
    });


    //DELETE de un dato especifico
    app.delete(BASE_API + "/precipitation-stats/:ine_code", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);
    
        database.remove({ ine_code: paramIneCode }, {}, (err, numRemoved) => {
            if (err) {
                res.status(500).send("Error al eliminar el recurso.");
                console.error(`ERROR: ${err}`)
            }else{
                if (numRemoved === 0) {
                    res.sendStatus(404); // No encontrado
                }else{
                    res.sendStatus(200); // OK
                }               
            }    
            
        });
    });
    app.get(BASE_API + "/precipitation-stats/:province/:year", (req, res) => {
        const year = Number(req.params.year);
        const province = req.params.province;
    
        database.find({ 
            year: year, 
            province: new RegExp("^" + province + "$", "i") 
        }, (err, docs) => {
            if (err) return res.status(500).send("Error al acceder a la base de datos.");
            if (!docs || docs.length === 0) return res.sendStatus(404);
    
            const sanitized = docs.map(({ _id, ...rest }) => rest);
            res.status(200).json(sanitized);
        });
    });
    app.put(BASE_API + "/precipitation-stats/:province/:year", (req, res) => {
        const year = Number(req.params.year);
        const province = req.params.province;
        const updatedData = req.body;
    
        if (updatedData.year !== year || updatedData.province !== province) {
            return res.status(400).json({ error: "Year and province in body must match URL parameters." });
        }
    
        database.update(
            { year: year, province: new RegExp("^" + province + "$", "i") },
            { $set: updatedData },
            { multi: true },
            (err, numReplaced) => {
                if (err) return res.status(500).send("Error al actualizar.");
                if (numReplaced === 0) return res.sendStatus(404);
                res.status(200).json({ message: "Updated successfully", modified: numReplaced });
            }
        );
    });
    app.delete(BASE_API + "/precipitation/:province/:year", (req, res) => {
        const year = Number(req.params.year);
        const province = req.params.province;
    
        database.remove(
            { year: year, province: new RegExp("^" + province + "$", "i") },
            { multi: true },
            (err, numRemoved) => {
                if (err) return res.status(500).send("Error al eliminar el recurso.");
                if (numRemoved === 0) return res.sendStatus(404);
                res.status(200).json({ message: "Deleted successfully", removed: numRemoved });
            }
        );
    });
    
}



export {loadBackendMJM, precipitation_stats, loadInitialDataMJM};