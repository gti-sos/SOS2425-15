<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<style>
    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 310px;
        max-width: 800px;
        margin: 1em auto;
    }

    #container {
        height: 400px;
    }

    .highcharts-description {
        margin: 0.3rem 10px;
    }
</style>

<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/temperature-stats";

    if (dev) {
        API = DEVEL_HOST + API;
    }

    let exChangesData = [];
    let result = "";
    let resultStatus = "";

    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, { method: "GET" });
            const data = await res.json();

            result = JSON.stringify(data, null, 2);
            exChangesData = data;
            console.log(`response received : ${JSON.stringify(exChangesData, null, 2)} `);
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }

    onMount(async () => {
        await getData();

        const average_temperatureProvince = {};

        exChangesData.forEach(entry => {
            const province = entry.province;
            const average_temperature = entry.average_temperature || 0;

            if (average_temperatureProvince[province]) {
                average_temperatureProvince[province] = Math.max(
                    average_temperatureProvince[province],
                    average_temperature
                );
            } else {
                average_temperatureProvince[province] = average_temperature;
            }
        });

        const categories = Object.keys(average_temperatureProvince);
        const temperatureData = Object.values(average_temperatureProvince);

        Highcharts.chart('container', {
            chart: {
                type: 'area' // ← CAMBIO AQUÍ
            },
            title: {
                text: 'average_temperature by province'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: 'Provincia'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'average_temperature'
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.5,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'average_temperature',
                data: temperatureData
            }]
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>