<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script> <!-- NECESARIO -->
  <script src="https://code.highcharts.com/modules/bubble.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const accidentAPI = "https://sos2425-19.onrender.com/api/v1/accident-rate-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;

    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(accidentAPI);
      const data = await response.json();

      // Agrupar por comunidad autónoma
      const grouped: Record<string, { injured_hospitalized: number; injured_not_hospitalized: number }> = {};

      data.forEach((entry: any) => {
        const key = entry.ccaa;
        if (!grouped[key]) {
          grouped[key] = { injured_hospitalized: 0, injured_not_hospitalized: 0 };
        }
        grouped[key].injured_hospitalized += entry.total_injured_hospitalized_with_injured_not_hospitalized || 0;
        grouped[key].injured_not_hospitalized += entry.total_injured_not_hospitalized_deducted || 0;
      });

      const bubbleData = Object.entries(grouped).map(([community, stats]) => ({
        name: community,
        x: stats.injured_hospitalized,
        y: stats.injured_not_hospitalized,
        z: stats.injured_hospitalized + stats.injured_not_hospitalized
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy'
        },
        title: {
          text: 'Sanciones vs. Puntos Retirados por Comunidad'
        },
        xAxis: {
          title: { text: 'Sanciones con puntos' }
        },
        yAxis: {
          title: { text: 'Puntos retirados' }
        },
        tooltip: {
          useHTML: true,
          headerFormat: '<b>{point.name}</b><br>',
          pointFormat: 'Sanciones: {point.x}<br>Puntos: {point.y}<br>Total: {point.z}'
        },
        plotOptions: {
          bubble: {
            minSize: 10,
            maxSize: 50
          }
        },
        series: [{
          name: 'Comunidades Autónomas',
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
    Gráfico de burbujas que muestra la relación entre sanciones con puntos y puntos retirados en cada comunidad autónoma.
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
