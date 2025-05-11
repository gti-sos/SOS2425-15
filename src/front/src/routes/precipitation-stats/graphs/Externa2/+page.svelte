<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/variable-pie.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const punkAPI = "https://api.punkapi.com/v2/beers?page=1&per_page=10";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(punkAPI);
      const beers = await response.json();

      const pieData = beers.map((beer: any) => ({
        name: beer.name,
        y: beer.volume.value,
        z: beer.abv
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'variablepie'
        },
        title: {
          text: 'Cervezas de BrewDog: Volumen y ABV'
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b><br/>' +
            'Volumen: <b>{point.y} {point.volume.unit}</b><br/>' +
            'ABV: <b>{point.z}%</b><br/>'
        },
        series: [{
          minPointSize: 10,
          innerSize: '20%',
          zMin: 0,
          name: 'Cervezas',
          data: pieData
        }]
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 600px;"></div>
  <p class="highcharts-description">
    Gráfico de pastel variable que muestra el volumen y la graduación alcohólica (ABV) de diferentes cervezas de BrewDog.
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

