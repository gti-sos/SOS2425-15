import dataStore from "nedb";
import path from "path";
import fs from "fs";

const database = new dataStore();

let temperature_stats = [
    {ine_code: 1, year: 2020, province: "Almería", average_temperature: 16.2, minimum_average: 11.2, maximum_average: 21.9},
    {ine_code: 2, year: 2020, province: "Cádiz", average_temperature: 18.0, minimum_average: 13.1, maximum_average: 23.6},
    {ine_code: 3, year: 2020, province: "Córdoba", average_temperature: 17.3, minimum_average: 11.0, maximum_average: 23.9},
    {ine_code: 4, year: 2020, province: "Granada", average_temperature: 14.5, minimum_average: 8.7, maximum_average: 20.9},
    {ine_code: 5, year: 2020, province: "Huelva", average_temperature: 17.9, minimum_average: 12.1, maximum_average: 24.1},
    {ine_code: 6, year: 2020, province: "Jaén", average_temperature: 16.3, minimum_average: 10.3, maximum_average: 22.9},
    {ine_code: 7, year: 2020, province: "Málaga", average_temperature: 17.0, minimum_average: 12.2, maximum_average: 22.4},
    {ine_code: 8, year: 2020, province: "Sevilla", average_temperature: 18.2, minimum_average: 12.1, maximum_average: 24.8},
    {ine_code: 9, year: 2021, province: "Almería", average_temperature: 16.1, minimum_average: 11.2, maximum_average: 21.6},
    {ine_code: 10, year: 2021, province: "Cádiz", average_temperature: 17.8, minimum_average: 13.0, maximum_average: 23.2},
    {ine_code: 11, year: 2021, province: "Córdoba", average_temperature: 17.0, minimum_average: 10.6, maximum_average: 23.7},
    {ine_code: 12, year: 2021, province: "Granada", average_temperature: 14.2, minimum_average: 8.4, maximum_average: 20.4},
    {ine_code: 13, year: 2021, province: "Huelva", average_temperature: 17.5, minimum_average: 11.6, maximum_average: 23.9},
    {ine_code: 14, year: 2021, province: "Jaén", average_temperature: 16.1, minimum_average: 9.9, maximum_average: 22.5},
    {ine_code: 15, year: 2021, province: "Málaga", average_temperature: 17.1, minimum_average: 12.2, maximum_average: 22.4},
    {ine_code: 16, year: 2021, province: "Sevilla", average_temperature: 18.0, minimum_average: 11.8, maximum_average: 24.7},
    {ine_code: 17, year: 2022, province: "Almería", average_temperature: 16.9, minimum_average: 11.7, maximum_average: 22.6},
    {ine_code: 18, year: 2022, province: "Cádiz", average_temperature: 18.7, minimum_average: 13.7, maximum_average: 24.2},
    {ine_code: 19, year: 2022, province: "Córdoba", average_temperature: 18.0, minimum_average: 11.3, maximum_average: 24.8},
    {ine_code: 20, year: 2022, province: "Granada", average_temperature: 15.4, minimum_average: 9.4, maximum_average: 21.9},
    {ine_code: 21, year: 2022, province: "Huelva", average_temperature: 18.3, minimum_average: 12.3, maximum_average: 24.8},
    {ine_code: 22, year: 2022, province: "Jaén", average_temperature: 17.1, minimum_average: 10.9, maximum_average: 23.7},
    {ine_code: 23, year: 2022, province: "Málaga", average_temperature: 17.9, minimum_average: 13.0, maximum_average: 23.3},
    {ine_code: 24, year: 2022, province: "Sevilla", average_temperature: 18.7, minimum_average: 12.4, maximum_average: 25.6},
    {ine_code: 25, year: 2023, province: "Almería", average_temperature: 17.1, minimum_average: 11.7, maximum_average: 23.0},
    {ine_code: 26, year: 2023, province: "Cádiz", average_temperature: 18.6, minimum_average: 13.4, maximum_average: 24.5},
    {ine_code: 27, year: 2023, province: "Córdoba", average_temperature: 17.8, minimum_average: 11.0, maximum_average: 24.8},
    {ine_code: 28, year: 2023, province: "Granada", average_temperature: 15.3, minimum_average: 9.1, maximum_average: 21.9},
    {ine_code: 29, year: 2023, province: "Huelva", average_temperature: 18.5, minimum_average: 12.3, maximum_average: 25.2},
    {ine_code: 30, year: 2023, province: "Jaén", average_temperature: 17.0, minimum_average: 10.5, maximum_average: 23.8},
    {ine_code: 31, year: 2023, province: "Málaga", average_temperature: 18.0, minimum_average: 12.9, maximum_average: 23.7},
    {ine_code: 32, year: 2023, province: "Sevilla", average_temperature: 18.8, minimum_average: 12.1, maximum_average: 25.9}
];

function loadInitialData(){
    return temperature_stats
}

const BASE_API = "/api/v1"

database.insert(temperature_stats, (err, newDocs) => {
    if (err) {
        return res.status(500).send("Error al insertar los datos.");
    }
})

function loadBackendGGT(app){
    
    // APIs de DLC
    app.get(BASE_API + "/temperature-stats/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42360081/2sB2cVdgvs"); 
    });

    app.get(BASE_API + "/temperature-stats/loadInitialData", (req, res) => {
        database.count({}, (err, count) => {
            if (err) {
                return res.status(500).send("Error al comprobar la base de datos.");
            }

            if (count > 0) {
                return res.status(400).json({ message: "Ya tiene datos" });
            }

            const initialData = loadInitialData();
            database.insert(initialData, (err, newDocs) => {
                if (err) {
                    return res.status(500).send("Error al insertar los datos.");
                }

                database.find({}, (err, temperatures) => {
                    if (err) {
                        return res.status(500).send("Error al recuperar los datos.");
                    }
                    res.send(JSON.stringify(temperatures.map((x)=>{
                        delete x._id;
                        return x;
                    }),null,2));
                });
            });
        });
    });

    // GET todos los datos con paginación
app.get(BASE_API + "/temperature-stats", (req, res) => {
    let {ine_code, year, province, average_temperature, minimum_average, maximum_average, from, to, limit, offset} = req.query;

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
    if (average_temperature) {
        query.average_temperature = Number(average_temperature);
    }
    
    if (minimum_average) {
        query.minimum_average = Number(minimum_average);
    }
    if (maximum_average) {
        query.maximum_average = Number(maximum_average);
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

    q.exec((err, temperature_stats) => {
        if (err) {
            return res.status(500).send("Error al acceder a la base de datos.");
        }

        // Eliminar _id de cada objeto
        const sanitized = temperature_stats.map(({ _id, ...rest }) => rest);

        res.send(JSON.stringify(sanitized));
    });
});


    //POST a todos los datos
    app.post(BASE_API + "/temperature-stats", (req, res) => {
        const {ine_code, year, province, average_temperature, minimum_average, maximum_average} = req.body;
        // Validar campos obligatorios
        if (
            ine_code === undefined || year === undefined || province === undefined || average_temperature === undefined ||
            minimum_average === undefined || maximum_average === undefined
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
    app.put(BASE_API + "/temperature-stats/",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //DELETE de todos los datos
    app.delete(BASE_API + "/temperature-stats", (req, res) => {
        database.remove({},{multi:true}); 
        console.log("Todos los datos han sido eliminados."); // Para ver en consola
        res.sendStatus(200); 
    });

    //GET de un dato especifico
    app.get(BASE_API + "/temperature-stats/:ine_code", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);
    
        database.findOne({ ine_code: paramIneCode }, (err, temperatures) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (!temperatures) {
                return res.sendStatus(404);
            }
            // Eliminar la propiedad _id antes de enviar
        const { _id, ...temperaturesWithoutId } = temperatures;
        res.status(200).json(temperaturesWithoutId);
        });
    });

//POST para resetear la base de datos a la version original
app.post(BASE_API + "/temperature-stats/reset", (req, res) => {
    database.remove({}, { multi: true }, (err) => {
        if (err) {
            return res.status(500).send("Error al limpiar la base de datos.");
        }    
        database.insert(temperature_stats, (err) => {
            if (err) {
                return res.status(500).send("Error al restaurar los datos iniciales.");
            }    
            res.status(200).send("Base de datos restaurada.");
        });
    });
});

    //FALLO DE POST de un dato especifico
    app.post(BASE_API + "/temperature-stats/:province",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //PUT de un dato especifico
    app.put(BASE_API + "/temperature-stats/:ine_code", (req, res) => {
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
    app.delete(BASE_API + "/temperature-stats/:ine_code", (req, res) => {
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
    app.get(BASE_API + "/temperature-stats/:province/:year", (req, res) => {
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
    app.put(BASE_API + "/temperature-stats/:province/:year", (req, res) => {
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



export {loadBackendGGT, temperature_stats, loadInitialData};