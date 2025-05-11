<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/bubble.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const precipitationAPI = "https://sos2425-15.onrender.com/api/v1/precipitation-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(precipitationAPI);
      const data = await response.json();

      // Convertimos los datos a formato de burbuja
      const bubbleData = data.map((entry: any) => ({
        name: entry.province + ' - ' + entry.year,
        x: entry.year,
        y: entry.average_precipitation,
        z: entry.max_precipitation
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy'
        },
        title: {
          text: 'Precipitación por Provincia y Año'
        },
        xAxis: {
          title: { text: 'Año' },
          allowDecimals: false
        },
        yAxis: {
          title: { text: 'Precipitación media (mm)' }
        },
        tooltip: {
          useHTML: true,
          headerFormat: '<b>{point.key}</b><br>',
          pointFormat: 'Año: {point.x}<br>Media: {point.y} mm<br>Máxima: {point.z} mm'
        },
        plotOptions: {
          bubble: {
            minSize: 10,
            maxSize: 50
          }
        },
        series: [{
          name: 'Provincias',
          data: bubbleData
        }]
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de burbujas que muestra la precipitación media y máxima por provincia y año.
  </p>
</figure>

<style>
  .highcharts-figure {
    max-width: 800px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>