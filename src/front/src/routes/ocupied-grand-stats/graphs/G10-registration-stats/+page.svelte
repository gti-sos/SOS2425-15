<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  // Asegúrate de importar Highcharts de forma correcta
  import Highcharts from 'highcharts';

  const localAPI = "https://sos2425-15.onrender.com/api/v1/ocupied-grand-stats";
  const remoteAPI = "https://sos2425-10.onrender.com/api/v1/registrations-stats";

  async function fetchAndProcessData(): Promise<void> {
    const [localRes, remoteRes] = await Promise.all([fetch(localAPI), fetch(remoteAPI)]);
    const localData = await localRes.json();
    const remoteData = await remoteRes.json();

    // Tipar correctamente los objetos
    const groundByYear: Record<number, number> = {};
    const registrationsByYear: Record<number, number> = {};

    for (const entry of localData) {
      const year = Number(entry.year);
      const ground = Number(entry.ground) || 0;
      groundByYear[year] = (groundByYear[year] || 0) + ground;
    }

    for (const entry of remoteData) {
      const year = Number(entry.year);
      const total = Number(entry.total_general) || 0;
      registrationsByYear[year] = (registrationsByYear[year] || 0) + total;
    }

    const allYears: number[] = Array.from(
      new Set([...Object.keys(groundByYear), ...Object.keys(registrationsByYear)].map(Number))
    ).sort((a, b) => a - b);

    const groundData = allYears.map(year => groundByYear[year] || 0);
    const regData = allYears.map(year => registrationsByYear[year] || 0);

    renderChart(allYears, groundData, regData);
  }

  // Usar una referencia a un contenedor para acceder a él correctamente
  let container: HTMLDivElement;

  function renderChart(years: number[], groundData: number[], regData: number[]): void {
    // Asegurarse de que container sea un HTMLElement válido
    if (!container) {
      console.error("Contenedor no encontrado");
      return;
    }

    // Ahora Highcharts.chart debería funcionar correctamente
    Highcharts.chart(container, {
      chart: {
        polar: true
      },
      title: {
        text: 'Comparación de Ocupación de Suelo vs Matriculaciones por Año'
      },
      subtitle: {
        text: 'Suma de Suelo Ocupado y Matriculaciones Generales'
      },
      pane: {
        startAngle: 0,
        endAngle: 360
      },
      xAxis: {
        categories: years.map(String),
        tickmarkPlacement: 'on',
        lineWidth: 0
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0
      },
      series: [
        {
          type: 'line',
          name: 'Suelo Ocupado (ground)',
          data: groundData,
          pointPlacement: 'on'
        },
        {
          type: 'line',
          name: 'Matriculaciones Generales',
          data: regData,
          pointPlacement: 'on'
        }
      ]
    });
  }

  onMount(() => {
    fetchAndProcessData();
  });
</script>

<figure class="highcharts-figure">
  <div bind:this={container} style="height: 400px;"></div>
  <p class="highcharts-description">
    Comparación polar entre superficie ocupada y matriculaciones generales por año.
  </p>
</figure>

<style>
  .highcharts-figure {
    min-width: 320px;
    max-width: 660px;
    margin: 1em auto;
  }

  .highcharts-description {
    margin: 0.3rem 10px;
  }
</style>