<!-- svelte-ignore css_unused_selector -->
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

    // 👇 Declara Highcharts como variable global para evitar errores de tipo
    declare let Highcharts: any;

    let API = "https://disease.sh/v3/covid-19/countries";

    // 👇 Define el tipo del array con una interfaz mínima
    interface CountryData {
        country: string;
        cases: number;
    }

    let covidData: CountryData[] = [];
    let result = "";
    let resultStatus = "";

    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, { method: "GET" });
            const data: CountryData[] = await res.json();

            result = JSON.stringify(data, null, 2);
            covidData = data;
            console.log(`response received : ${JSON.stringify(covidData, null, 2)} `);
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }

    onMount(async () => {
        await getData();

        // 👇 Tipamos correctamente como objeto indexado
        const countryCases: Record<string, number> = {};

        covidData
            .sort((a, b) => b.cases - a.cases)
            .slice(0, 10)
            .forEach(entry => {
                const country = entry.country;
                const cases = entry.cases || 0;
                countryCases[country] = cases;
            });

        const categories = Object.keys(countryCases);
        const casesData = Object.values(countryCases);

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Top 10 países por casos de COVID-19'
            },
            xAxis: {
                categories: categories,
                crosshair: true,
                accessibility: {
                    description: 'País'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Casos Totales'
                }
            },
            tooltip: {
                valueSuffix: ' casos'
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Casos',
                data: casesData
            }]
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>
