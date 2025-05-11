<!-- svelte-ignore css_unused_selector -->
<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css" rel="stylesheet" />
</svelte:head>

<style>
    .chart-wrapper {
        max-width: 600px;
        margin: 2em auto;
    }

    .c3-tooltip {
        font-size: 14px;
    }
</style>

<script>
	//@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/ocupied-grand-stats";

    if (dev) {
        API = DEVEL_HOST + API;
    }

    let exChangesData = [];

    async function getData() {
        try {
            const res = await fetch(API, { method: "GET" });
            const data = await res.json();
            exChangesData = data;
            console.log("API data:", data);
        } catch (error) {
            console.error(`Error fetching data from ${API}:`, error);
        }
    }

    onMount(async () => {
        await getData();

        const groundProvince = {};

        exChangesData.forEach(entry => {
            const province = entry.province;
            const ground = entry.ground || 0;
            if (groundProvince[province]) {
                groundProvince[province] += ground;
            } else {
                groundProvince[province] = ground;
            }
        });

        const pieData = Object.entries(groundProvince);

        c3.generate({
            bindto: '#chart',
            data: {
                columns: pieData,
                type: 'pie'
            },
            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return `${value} MT`;
                    }
                }
            }
        });
    });
</script>

<div class="chart-wrapper">
    <div id="chart"></div>
</div>
