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

<script>
	//@ts-nocheck
    import { onMount } from "svelte";
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16079";
    let API= "/api/v1/precipitation-stats";

    if (dev){
        API= DEVEL_HOST + API
    };

    let exChangesData=[];
    let result="";
    let resultStatus="";

    async function getData(){
        resultStatus = result = "";
        try{
            const res = await fetch(API,{method:"GET"});
            const data= await res.json();


            result = JSON.stringify(data,null,2);
            exChangesData= data;
            console.log(`response received : ${JSON.stringify(exChangesData,null,2)} `)
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
    

    onMount(async() =>{
        await getData();
        
        const annualProvince = {};

        exChangesData.forEach(entry => {
            const province = entry.province;
            const annual_precipitation = entry.annual_precipitation || 0;

            if (annualProvince[province]) {
                annualProvince[province] += annual_precipitation;
            } else {
                annualProvince[province] = annual_precipitation;
            }
        });

        const categories = Object.keys(annualProvince);
        const precipitacionData = Object.values(annualProvince);    
        
        Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Total annual precipitation by province'
        },
        
        xAxis: {
            categories: categories,
            crosshair: true,
            accessibility: {
                description: 'provincia'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'total precipitation'
            }
        },
        tooltip: {
            valueSuffix: ' (1000 MT)'
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Ground',
            data: precipitacionDataData
        }]
    });
    });

</script>

<figure class="highcharts-figure">
    <div id="container"></div>
    
</figure>