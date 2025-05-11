<script context="module" lang="ts">
    // 👇 Declaración de variable global válida en este contexto
    declare let Highcharts: any;
</script>

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

    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #ebebeb;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }

    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }

    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }

    .highcharts-data-table td,
    .highcharts-data-table th,
    .highcharts-data-table caption {
        padding: 0.5em;
    }

    .highcharts-data-table thead tr,
    .highcharts-data-table tbody tr:nth-child(even) {
        background: #f8f8f8;
    }

    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }

    .highcharts-description {
        margin: 0.3rem 10px;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";

    let API = "https://restcountries.com/v3.1/all";

    interface Country {
        name: {
            common: string;
        };
        population: number;
    }

    let countries: Country[] = [];
    let result = "";
    let resultStatus = "";

    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API);
            const data: Country[] = await res.json();

            result = JSON.stringify(data, null, 2);
            countries = data;
            console.log("Received countries:", countries);
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }

    onMount(async () => {
        await getData();

        // Obtener los 10 países más poblados
        const topCountries = countries
            .filter(c => c.population && c.name?.common)
            .sort((a, b) => b.population - a.population)
            .slice(0, 10);

        const totalPop = topCountries.reduce((sum, c) => sum + c.population, 0);

        const dataSeries = topCountries.map(c => ({
            name: c.name.common,
            y: (c.population / totalPop) * 100
        }));

        Highcharts.chart('container', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Top 10 países por población (porcentaje entre ellos)'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Población',
                colorByPoint: true,
                data: dataSeries
            }]
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>
