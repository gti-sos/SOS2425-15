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
        height: 500px;
    }

    .highcharts-description {
        margin: 0.3rem 10px;
    }
</style>

<script>
    import { onMount } from "svelte";

    const API_URL = "https://sos2425-17.onrender.com/api/v2/university-demands";
    let universityData = [];

    async function fetchUniversityData() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            universityData = data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    onMount(async () => {
        await fetchUniversityData();

        // Agrupar por provincia y año
        const groupedData = {};

        universityData.forEach(entry => {
            const province = entry.province;
            const year = entry.year;
            const graduates = parseInt(entry.graduates) || 0;

            if (!groupedData[province]) groupedData[province] = {};
            if (!groupedData[province][year]) groupedData[province][year] = 0;

            groupedData[province][year] += graduates;
        });

        const years = [...new Set(universityData.map(e => e.year))].sort();
        const provinces = Object.keys(groupedData).sort();

        const series = years.map(year => ({
            name: year.toString(),
            data: provinces.map(prov => groupedData[prov][year] || 0)
        }));

        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Graduados universitarios por provincia y año'
            },
            xAxis: {
                categories: provinces,
                title: {
                    text: 'Provincia'
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Número de graduados'
                }
            },
            tooltip: {
                valueSuffix: ' graduados'
            },
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    dataLabels: {
                        enabled: true
                    },
                    groupPadding: 0.1
                }
            },
            credits: {
                enabled: false
            },
            series
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>