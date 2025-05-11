<!-- svelte-ignore css_unused_selector -->
<svelte:head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
</svelte:head>

<style>
    .c3-chart {
        max-width: 600px;
        margin: 1rem auto;
    }

    .highcharts-description {
        margin: 0.3rem 10px;
    }
    #c3-container {
    height: 400px; /* o el alto que prefieras */
    }
</style>

<script>
    //@ts-nocheck
    import { onMount } from "svelte";

    const API = "/api/v1/ocupied-grand-stats";

    let apiData = [];

    async function getData() {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            apiData = data;
        } catch (error) {
            console.error(`ERROR fetching data from ${API}: ${error}`);
        }
    }

    onMount(async () => {
        await getData();

        // Convertir datos a columnas tipo ['Provincia', totalGround]
        const columns = apiData.map(entry => [
            entry.province,
            Number(entry.totalGround) || 0
        ]);

        c3.generate({
            bindto: '#c3-container',
            data: {
                columns: columns,
                type: 'donut'
            },
            donut: {
                title: "Ocupación por provincia"
            }
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="c3-container" class="c3-chart"></div>
</figure>
