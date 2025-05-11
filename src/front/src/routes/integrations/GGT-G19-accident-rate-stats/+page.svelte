<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
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
      const grouped: Record<string, { deceased: number; injured_hospitalized: number; injured_not_hospitalized: number }> = {};

      data.forEach((entry: any) => {
        const key = entry.ccaa;
        if (!grouped[key]) {
          grouped[key] = { deceased: 0, injured_hospitalized: 0, injured_not_hospitalized: 0 };
        }
        grouped[key].deceased += entry.total_deceased || 0;
        grouped[key].injured_hospitalized += entry.injured_hospitalized || 0;
        grouped[key].injured_not_hospitalized += entry.injured_not_hospitalized || 0;
      });

      const bubbleData = Object.entries(grouped).map(([community, stats]) => ({
        name: community,
        x: stats.injured_hospitalized,
        y: stats.injured_not_hospitalized,
        z: stats.deceased + stats.injured_hospitalized + stats.injured_not_hospitalized
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy'
        },
        title: {
          text: 'Fallecidos y heridos (hospitalizados y no) por CCAA'
        },
        xAxis: {
          title: { text: 'Heridos hospitalizados' }
        },
        yAxis: {
          title: { text: 'Heridos no hospitalizados' }
        },
        tooltip: {
          useHTML: true,
          headerFormat: '<b>{point.name}</b><br>',
          pointFormat: 'Hospitalizados: {point.x}<br>No hospitalizados: {point.y}<br>Total (incl. fallecidos): {point.z}'
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
    Gráfico de burbujas que muestra la relación entre heridos hospitalizados, no hospitalizados y fallecidos por comunidad autónoma.
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