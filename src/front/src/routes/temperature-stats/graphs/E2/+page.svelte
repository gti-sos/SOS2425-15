<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const covidAPI = "https://disease.sh/v3/covid-19/historical/USA?lastdays=7";

  onMount(async () => {
    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(covidAPI);
      const data = await response.json();
      const timeline = data.timeline.cases;

      const dates = Object.keys(timeline);
      const cases = Object.values(timeline);

      // Calcular nuevos casos diarios (diferencia entre días consecutivos)
      const dailyCases = cases.map((value, index) =>
        index === 0 ? 0 : value - cases[index - 1]
      );

      Highcharts.chart('container', {
        chart: {
          type: 'area'
        },
        title: {
          text: 'Casos diarios de COVID-19 en EE.UU. (últimos 7 días)'
        },
        xAxis: {
          categories: dates,
          title: {
            text: 'Fecha'
          }
        },
        yAxis: {
          title: {
            text: 'Casos nuevos'
          }
        },
        tooltip: {
          pointFormat: '<b>{point.y} casos nuevos</b>'
        },
        series: [{
          name: 'Casos diarios',
          data: dailyCases
        }]
      });

    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de áreas mostrando la cantidad de casos nuevos de COVID-19 en EE.UU. durante la última semana.
  </p>
</figure>

<style>
  .highcharts-figure {
    max-width: 900px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>