<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const accidentsAPI = "https://sos2425-10.onrender.com/api/v2/accidents-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(accidentsAPI);
      const data = await response.json();

      // Agrupar accidentes por provincia
      const grouped: Record<string, number> = {};
      data.forEach((entry: any) => {
        const province = entry.province;
        const accidents = entry.total_victims || 0;
        if (!grouped[province]) {
          grouped[province] = 0;
        }
        grouped[province] += accidents;
      });

      const categories = Object.keys(grouped);
      const seriesData = Object.values(grouped);

      Highcharts.chart('container', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Número total de accidentes por provincia'
        },
        xAxis: {
          categories: categories,
          title: { text: 'Provincia' },
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: { text: 'Accidentes' }
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat: '<b>{point.key}</b><br>',
          pointFormat: 'Accidentes: {point.y}'
        },
        series: [{
          name: 'Accidentes',
          data: seriesData
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
    Gráfico de columnas que muestra el número total de accidentes reportados por provincia.
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



