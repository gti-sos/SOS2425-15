<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const dogAPI = "https://dog.ceo/api/breeds/list/all";

  onMount(async () => {
    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(dogAPI);
      const data = await response.json();
      const breeds = data.message;

      // Convertir a estructura: grupo -> cantidad de subrazas
      const breedData = Object.entries(breeds).map(([breed, subBreeds]) => ({
        name: breed,
        count: (subBreeds as any[]).length || 1
      }));

      // Ordenar y tomar los 10 primeros con más subrazas
      const topBreeds = breedData
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      Highcharts.chart('container', {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Top 10 Razas de Perros con más Subrazas'
        },
        xAxis: {
          categories: topBreeds.map(b => b.name),
          title: {
            text: 'Raza'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Cantidad de subrazas'
          }
        },
        tooltip: {
          valueSuffix: ' subrazas'
        },
        series: [{
          name: 'Subrazas',
          data: topBreeds.map(b => b.count)
        }]
      });

    } catch (error) {
      console.error("Error al obtener datos de perros:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de barras que muestra las razas de perros con mayor número de subrazas según la API pública de Dog.ceo.
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