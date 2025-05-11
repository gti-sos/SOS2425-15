<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/packed-bubble.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const precipitationAPI = "https://sos2425-15.onrender.com/api/v1/precipitation-stats";
  const temperatureAPI = "https://sos2425-15.onrender.com/api/v1/temperature-stats";
  const housingAPI = "https://sos2425-15.onrender.com/api/v1/ocupied-grand-stats";

  type BubbleData = {
    name: string;
    value: number;
    color?: string;
  };

  onMount(async () => {
    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) return;

    try {
      const [precRes, tempRes, houseRes] = await Promise.all([
        fetch(precipitationAPI),
        fetch(temperatureAPI),
        fetch(housingAPI)
      ]);

      const [precData, tempData, houseData] = await Promise.all([
        precRes.json(),
        tempRes.json(),
        houseRes.json()
      ]);

      const dataMap: Record<string, BubbleData> = {};

      // Usamos como clave la comunidad autónoma
      houseData.forEach((entry: any) => {
        const region = entry.province;
        const occupied = entry.ground|| 0;

        dataMap[region] = {
          name: region,
          value: occupied
        };
      });

      // Asignar color en función de la temperatura (mayor temperatura, color más rojo)
      tempData.forEach((entry: any) => {
        const region = entry.province;
        const temp = entry.maximum_average;
        if (dataMap[region] && typeof temp === "number") {
          const r = Math.min(255, Math.round(100 + temp * 5));
          const b = 255 - r;
          dataMap[region].color = `rgb(${r}, 100, ${b})`;
        }
      });

      const chartData = Object.values(dataMap);

      Highcharts.chart('container', {
        chart: {
          type: 'packedbubble'
        },
        title: {
          text: 'Ocupación de viviendas vs Temperatura media (por provincia) y Precipitación anual'
        },
        tooltip: {
          useHTML: true,
          pointFormat: '<b>{point.name}</b><br/>Viviendas ocupadas: {point.value}'
        },
        plotOptions: {
          packedbubble: {
            minSize: '30%',
            maxSize: '120%',
            zMin: 0,
            zMax: Math.max(...chartData.map(d => d.value)),
            layoutAlgorithm: {
              gravitationalConstant: 0.05,
              splitSeries: false,
              seriesInteraction: false,
              dragBetweenSeries: false,
              parentNodeLimit: true
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              filter: {
                property: 'y',
                operator: '>',
                value: 10000
              },
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal'
              }
            }
          }
        },
        series: [{
          name: 'Viviendas ocupadas',
          data: chartData
        }]
      });

    } catch (error) {
      console.error("Error combinando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 600px;"></div>
  <p class="highcharts-description">
    Cada burbuja representa una provincia. El tamaño indica el número de terreno ocupados, y el color refleja la temperatura media anual y la precipitaon anual.
  </p>
</figure>

<style>
  .highcharts-figure {
    max-width: 1000px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>
