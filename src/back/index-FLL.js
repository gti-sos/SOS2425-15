import dataStore from "nedb";


const database = new dataStore();

/*
const ocupied_grand_stats = [
    {year: 2021, province: "cadiz", ground: 177000, grass: 300000, wooded: 250000, non_agrarian_surface: 70000},
    {year: 2021, province: "almería", ground: 177590, grass: 363915, wooded: 257241, non_agrarian_surface: 78557},
    {year: 2021, province: "cordoba", ground: 728625, grass: 161589, wooded: 391269, non_agrarian_surface: 95577},
    {year: 2020, province: "granada", ground: 534974, grass: 158569, wooded: 490865, non_agrarian_surface: 80282},
    {year: 2019, province: "cadiz", ground: 287411, grass: 113120, wooded: 240573, non_agrarian_surface: 102517},
    {year: 2018, province: "jaén", ground: 651284, grass: 141269, wooded: 482836, non_agrarian_surface: 74220},
    {year: 2020, province: "sevilla", ground: 806241, grass: 137214, wooded: 313296, non_agrarian_surface: 146857},
    {year: 2021, province: "cadiz", ground: 285947, grass: 119568, wooded: 235314, non_agrarian_surface: 103006},
    {year: 2021, province: "caceres", ground: 397184, grass: 335124, wooded: 306463, non_agrarian_surface: 483914},
    {year: 2018, province: "cadiz", ground: 292937, grass: 109096, wooded: 239226, non_agrarian_surface: 102365}    
];
*/

const ocupied_grand_stats = [
    {ine_code: 1, year: 2021, province: "cadiz", ground: 177000, grass: 300000, wooded: 250000, non_agrarian_surface: 70000},
    {ine_code: 2, year: 2021, province: "almería", ground: 177590, grass: 363915, wooded: 257241, non_agrarian_surface: 78557},
    {ine_code: 3, year: 2021, province: "cordoba", ground: 728625, grass: 161589, wooded: 391269, non_agrarian_surface: 95577},
    {ine_code: 4, year: 2020, province: "granada", ground: 534974, grass: 158569, wooded: 490865, non_agrarian_surface: 80282},
    {ine_code: 5, year: 2019, province: "cadiz", ground: 287411, grass: 113120, wooded: 240573, non_agrarian_surface: 102517},
    {ine_code: 6, year: 2018, province: "jaén", ground: 651284, grass: 141269, wooded: 482836, non_agrarian_surface: 74220},
    {ine_code: 7, year: 2020, province: "sevilla", ground: 806241, grass: 137214, wooded: 313296, non_agrarian_surface: 146857},
    {ine_code: 8, year: 2021, province: "cadiz", ground: 285947, grass: 119568, wooded: 235314, non_agrarian_surface: 103006},
    {ine_code: 9, year: 2021, province: "caceres", ground: 397184, grass: 335124, wooded: 306463, non_agrarian_surface: 483914},
    {ine_code: 10, year: 2018, province: "cadiz", ground: 292937, grass: 109096, wooded: 239226, non_agrarian_surface: 102365}    
];



function loadInitialDataFLL(){
        
    return ocupied_grand_stats
}

const BASE_API = "/api/v1"

database.insert(ocupied_grand_stats, (err, newDocs) => {
    if (err) {
        return res.status(500).send("Error al insertar los datos.");
    }
})

function loadBackendFLL(app){
    
    // APIs de FLL
    app.get(BASE_API + "/ocupied-grand-stats/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42153958/2sAYkLncz8"); 
    });

    app.get(BASE_API + "/ocupied-grand-stats/loadInitialDataFLL", (req, res) => {
        database.count({}, (err, count) => {
            if (err) {
                return res.status(500).send("Error al comprobar la base de datos.");
            }

            if (count > 0) {
                return res.status(400).json({ message: "Ya tiene datos" });
            }

            const initialData = loadInitialDataFLL();
            database.insert(initialData, (err, newDocs) => {
                if (err) {
                    return res.status(500).send("Error al insertar los datos.");
                }

                database.find({}, (err, ocupieds) => {
                    if (err) {
                        return res.status(500).send("Error al recuperar los datos.");
                    }
                    res.send(JSON.stringify(ocupieds.map((x)=>{
                        delete x._id;
                        return x;
                    }),null,2));
                });
            });
        });
    });

    // GET todos los datos con paginación
app.get(BASE_API + "/ocupied-grand-stats", (req, res) => {
    let {ine_code, year, province, ground, grass, wooded, non_agrarian_surface, from, to, limit, offset} = req.query;

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
    if (ground) {
        query.ground = Number(ground);
    }
    
    if (grass) {
        query.grass = Number(grass);
    }
    if (wooded) {
        query.wooded = Number(wooded);
    }
    if (non_agrarian_surface) {
        query.non_agrarian_surface = Number(non_agrarian_surface);
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

    q.exec((err, ocupied_grand_stats) => {
        if (err) {
            return res.status(500).send("Error al acceder a la base de datos.");
        }

        // Eliminar _id de cada objeto
        const sanitized = ocupied_grand_stats.map(({ _id, ...rest }) => rest);

        res.send(JSON.stringify(sanitized));
    });
});


    //POST a todos los datos
    app.post(BASE_API + "/ocupied-grand-stats", (req, res) => {
        const {ine_code, year, province, ground, grass, wooded, non_agrarian_surface} = req.body;
        // Validar campos obligatorios
        if (
            ine_code === undefined || year === undefined || province === undefined || ground === undefined ||
            grass === undefined || wooded === undefined || non_agrarian_surface === undefined
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
    app.put(BASE_API + "/ocupied-grand-stats/",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //DELETE de todos los datos
    app.delete(BASE_API + "/ocupied-grand-stats", (req, res) => {
        database.remove({},{multi:true}); 
        console.log("Todos los datos han sido eliminados."); // Para ver en consola
        res.sendStatus(200); 
    });

    //GET de un dato especifico
    app.get(BASE_API + "/ocupied-grand-stats/:ine_code", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);
    
        database.findOne({ ine_code: paramIneCode }, (err, ocupieds) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (!ocupieds) {
                return res.sendStatus(404);
            }
            // Eliminar la propiedad _id antes de enviar
        const { _id, ...ocupiedsWithoutId } = ocupieds;
        res.status(200).json(ocupiedsWithoutId);
        });
    });

//POST para resetear la base de datos a la version original
app.post(BASE_API + "/ocupied-grand-stats/reset", (req, res) => {
    database.remove({}, { multi: true }, (err) => {
        if (err) {
            return res.status(500).send("Error al limpiar la base de datos.");
        }    
        database.insert(ocupied_grand_stats, (err) => {
            if (err) {
                return res.status(500).send("Error al restaurar los datos iniciales.");
            }    
            res.status(200).send("Base de datos restaurada.");
        });
    });
});

    //FALLO DE POST de un dato especifico
    app.post(BASE_API + "/ocupied-grand-stats/:province",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //PUT de un dato especifico
    app.put(BASE_API + "/ocupied-grand-stats/:ine_code", (req, res) => {
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
    app.delete(BASE_API + "/ocupied-grand-stats/:ine_code", (req, res) => {
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
    app.get(BASE_API + "/ocupied-grand-stats/:province/:year", (req, res) => {
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
    app.put(BASE_API + "/ocupied-grand-stats/:province/:year", (req, res) => {
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
    app.delete(BASE_API + "/ocupied/:province/:year", (req, res) => {
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



export {loadBackendFLL, ocupied_grand_stats, loadInitialDataFLL};