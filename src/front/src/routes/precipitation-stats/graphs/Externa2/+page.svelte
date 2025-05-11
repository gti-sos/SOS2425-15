<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/variable-pie.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const airStatsAPI = "https://sos2425-24.onrender.com/api/v1/air-transport-stats";

  type AirData = {
    country: string;
    total_passengers: number;
    total_flights: number;
  };

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(airStatsAPI);
      const stats: AirData[] = await response.json();

      const data = stats
        .filter(d => d.total_passengers > 0 && d.total_flights > 0)
        .map(d => ({
          name: d.country,
          y: d.total_flights,
          z: d.total_passengers
        }));

      Highcharts.chart('container', {
        chart: {
          type: 'variablepie'
        },
        title: {
          text: 'Transporte aéreo por país: vuelos vs pasajeros'
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}</b><br/>Vuelos: {point.y}<br/>Pasajeros: {point.z}'
        },
        series: [{
          minPointSize: 10,
          innerSize: '20%',
          zMin: 0,
          name: 'Países',
          data
        }]
      });
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de pastel variable: el tamaño representa el número de vuelos y el radio, la cantidad de pasajeros.
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




