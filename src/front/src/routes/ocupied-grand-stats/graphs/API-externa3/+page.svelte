<script context="module" lang="ts">
    declare let Highcharts: any;
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/variable-pie.js"></script>
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
</style>

<script lang="ts">
    import { onMount } from "svelte";

    let API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1";

    interface Crypto {
        name: string;
        market_cap: number;
        total_volume: number;
    }

    let cryptos: Crypto[] = [];

    async function getData() {
        try {
            const res = await fetch(API);
            const data: Crypto[] = await res.json();
            cryptos = data;
            console.log("Received cryptos:", cryptos);
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }

    onMount(async () => {
        await getData();

        const totalVolume = cryptos.reduce((sum, c) => sum + c.total_volume, 0);

        const dataSeries = cryptos.map(c => ({
            name: c.name,
            y: c.total_volume,
            z: c.market_cap // tamaño visual proporcional a la capitalización
        }));

        Highcharts.chart('container', {
            chart: {
                type: 'variablepie'
            },
            title: {
                text: 'Top 10 Criptomonedas por Volumen (24h)'
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b><br/>' +
                    'Volumen: <b>${point.y:,.0f}</b><br/>' +
                    'Capitalización: <b>${point.z:,.0f}</b><br/>'
            },
            series: [{
                minPointSize: 10,
                innerSize: '20%',
                zMin: 1000000,
                name: 'Criptomonedas',
                data: dataSeries
            }]
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>