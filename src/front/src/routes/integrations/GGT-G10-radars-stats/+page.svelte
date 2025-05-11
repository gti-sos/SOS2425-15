<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  const localAPI = "https://sos2425-15.onrender.com/api/v1/temperature-stats";
  const remoteAPI = "https://sos2425-10.onrender.com/api/v1/radars-stats";

  async function fetchAndProcessData(): Promise<void> {
    const [localRes, remoteRes] = await Promise.all([
      fetch(localAPI),
      fetch(remoteAPI)
    ]);
    const localData = await localRes.json();
    const remoteData = await remoteRes.json();

    // Tipar correctamente los objetos
    const minimum_temperatureByYear: Record<number, number> = {};
    const complaintByYear: Record<number, number> = {};

    for (const entry of localData) {
      const year = Number(entry.year);
      const minimum_temperature = Number(entry.minimum_temperature) || 0;
      minimum_temperatureByYear[year] = (minimum_temperatureByYear[year] || 0) + minimum_temperature;
    }

    for (const entry of remoteData) {
      const year = Number(entry.year);
      const total = Number(entry.total_general) || 0;
      complaintByYear[year] = (complaintByYear[year] || 0) + total;
    }

    const allYears: number[] = Array.from(
      new Set([...Object.keys(minimum_temperatureByYear), ...Object.keys(complaintByYear)].map(Number))
    ).sort((a, b) => a - b);

    const minimum_temperatureData = allYears.map(year => minimum_temperatureByYear[year] || 0);
    const regData = allYears.map(year => complaintByYear[year] || 0);

    renderChart(allYears, minimum_temperatureData, regData);
  }

  function renderChart(years: number[], minimum_temperatureData: number[], regData: number[]): void {
    Highcharts.chart('container', {
      chart: {
        polar: true
      },
      title: {
        text: 'Comparación de temperatura mínima vs (cambiar)Matriculaciones por Año'
      },
      subtitle: {
        text: 'Suma de Suelo Ocupado y (cambiar)Matriculaciones Generales'
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
          name: 'Temperatura mínima (minimum_temperature)',
          data: minimum_temperatureData,
          pointPlacement: 'on'
        },
        {
          type: 'line',
          name: 'Matriculaciones Generales (cambiar)',
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
  <div id="container"></div>
  <p class="highcharts-description">
    (cambiar)Comparación polar entre superficie ocupada y matriculaciones generales por año.
  </p>
</figure>

<style>
.highcharts-figure,
.highcharts-data-table table {
  min-width: 320px;
  max-width: 660px;
  margin: 1em auto;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}

.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tbody tr:nth-child(even) {
  background: #f8f8f8;
}

.highcharts-data-table tr:hover {
  background: #f1f7ff;
}

.highcharts-description {
  margin: 0.3rem 10px;
}
</style>
