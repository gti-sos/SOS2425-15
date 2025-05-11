<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/packed-bubble.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const countriesAPI = "https://restcountries.com/v3.1/all";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(countriesAPI);
      const countries = await response.json();

      const regionData: Record<string, any[]> = {};

      countries.forEach((country: any) => {
        const region = country.region || "Other";
        if (!regionData[region]) regionData[region] = [];

        regionData[region].push({
          name: country.name.common,
          value: country.population || 0
        });
      });

      const bubbleSeries = Object.entries(regionData).map(([region, countries]) => ({
        name: region,
        data: countries
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'packedbubble'
        },
        title: {
          text: 'Población por país agrupada por región'
        },
        tooltip: {
          useHTML: true,
          pointFormat: '<b>{point.name}:</b> {point.value} habitantes'
        },
        plotOptions: {
          packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1400000000,
            layoutAlgorithm: {
              gravitationalConstant: 0.05,
              splitSeries: true,
              seriesInteraction: false,
              dragBetweenSeries: true,
              parentNodeLimit: true
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              filter: {
                property: 'y',
                operator: '>',
                value: 100000000 // solo etiquetas para países con +100M
              },
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal'
              }
            }
          }
        },
        series: bubbleSeries
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 600px;"></div>
  <p class="highcharts-description">
    Gráfico de burbujas agrupadas mostrando la población de los países, organizada por región.
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
