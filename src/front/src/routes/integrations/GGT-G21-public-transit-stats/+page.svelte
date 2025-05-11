<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const transitAPI = "https://sos2425-21.onrender.com/api/v1/public-transit-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;

    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(transitAPI);
      const data = await response.json();

      // Agrupar por provincia (último año disponible por provincia)
      const latestPerProvince: Record<string, any> = {};

      data.forEach((entry: any) => {
        const province = entry.province;
        if (!latestPerProvince[province] || entry.year > latestPerProvince[province].year) {
          latestPerProvince[province] = entry;
        }
      });

      const scatterData = Object.values(latestPerProvince).map((entry: any) => ({
        name: entry.province,
        x: entry.route_length,
        y: entry.total_trips
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: 'Relación entre longitud de red y número de viajes por provincia (último año)'
        },
        xAxis: {
          title: {
            enabled: true,
            text: 'Longitud de red (km)'
          }
        },
        yAxis: {
          title: {
            text: 'Número de viajes'
          }
        },
        tooltip: {
          useHTML: true,
          headerFormat: '<b>{point.name}</b><br>',
          pointFormat: 'Longitud: {point.x} km<br>Viajes: {point.y}'
        },
        series: [{
          name: 'Provincias',
          color: 'rgba(223, 83, 83, .5)',
          data: scatterData
        }]
      });

    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de dispersión que muestra la relación entre la longitud de la red de transporte público y el número total de viajes por provincia (último año disponible).
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