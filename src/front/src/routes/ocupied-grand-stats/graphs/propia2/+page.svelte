    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8" />
    <title>Gráfico de Superficie No Agraria</title>
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    </head>
    <body>
    <h2>Distribución de Superficie No Agraria por Provincia (2021)</h2>
    <div id="grafico" style="width:600px;height:600px;"></div>

    <script>
        async function cargarDatos() {
        try {
            const respuesta = await fetch("https://sos2425-15.onrender.com/api/v1/ocupied-grand-stats/");
            const datos = await respuesta.json();

            // Filtrar solo los datos del año 2021
            const datos2021 = datos.filter(item => item.year === 2021);

            // Agrupar por provincia, sumando superficies no agrarias
            const agrupado = {};
            datos2021.forEach(d => {
            if (!agrupado[d.province]) {
                agrupado[d.province] = 0;
            }
            agrupado[d.province] += d.non_agrarian_surface;
            });

            const provincias = Object.keys(agrupado);
            const superficies = Object.values(agrupado);

            const data = [{
            type: "pie",
            labels: provincias,
            values: superficies,
            textinfo: "label+percent",
            hoverinfo: "label+value"
            }];

            Plotly.newPlot("grafico", data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            const div = document.getElementById("grafico");
            if (div) {
            div.innerText = "Error al cargar los datos.";
            }
        }
        }

        cargarDatos();
    </script>
    </body>
    </html>
