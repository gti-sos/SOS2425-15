<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/bubble.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const sanctionsAPI = "https://sos2425-19.onrender.com/api/v1/sanctions-and-points-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(sanctionsAPI);
      const data = await response.json();

      // Agrupar por comunidad autónoma
      const grouped: Record<string, { sanctions: number, points: number }> = {};

      data.forEach((entry: any) => {
        const key = entry.autonomous_community;
        if (!grouped[key]) {
          grouped[key] = { sanctions: 0, points: 0 };
        }
        grouped[key].sanctions += entry.total_sanctions_with_points || 0;
        grouped[key].points += entry.total_points_deducted || 0;
      });

      // Convertimos a array de burbujas
      const bubbleData = Object.entries(grouped).map(([community, stats]) => ({
        name: community,
        x: stats.sanctions,
        y: stats.points,
        z: stats.sanctions + stats.points
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
          headerFormat: '<b>{point.key}</b><br>',
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
