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

    #c3-container {
        height: 400px;
    }

    .highcharts-description {
        margin: 0.3rem 10px;
    }
</style>

<script>
    //@ts-nocheck
    import { onMount } from "svelte";

    let DEVEL_HOST= "http://localhost:16079";
    let API= "/api/v1/ocupied-grand-stats";

    if (dev){
        API= DEVEL_HOST + API
    };

    let apiData = [];

    async function getData() {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            apiData = await res.json();
        } catch (error) {
            console.error(`ERROR fetching data from ${API}: ${error}`);
        }
    }

    onMount(async () => {
        await getData();

        if (!apiData || apiData.length === 0) {
            console.warn("No data received");
            return;
        }

        // Suponemos que cada entrada tiene formato: { province: '...', totalGround: number }
        const columns = apiData.map(entry => [
            entry.province,
            Number(entry.totalGround) || 0
        ]);

        // Espera a que el DOM esté listo
        setTimeout(() => {
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
        }, 100);
    });
</script>

<figure class="highcharts-figure">
    <div id="c3-container" class="c3-chart"></div>
</figure>