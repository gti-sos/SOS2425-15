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
    const minimum_averageByYear: Record<number, number> = {};
    const averageSpeedFinedByYear: Record<number, number> = {};
    const countByYear: Record<number, number> = {};


    for (const entry of localData) {
      const year = Number(entry.year);
      const minimum_average = Number(entry.minimum_average) || 0;
      minimum_averageByYear[year] = (minimum_averageByYear[year] || 0) + minimum_average;
    }

    for (const entry of remoteData) {
      const year = Number(entry.year);
      const averageSpeedFined = Number(entry.averageSpeedFined) || 0;

      averageSpeedFinedByYear[year] = (averageSpeedFinedByYear[year] || 0) + averageSpeedFined;
      countByYear[year] = (countByYear[year] || 0) + 1;
    }

    for (const year in averageSpeedFinedByYear) {
      const y = Number(year);
      averageSpeedFinedByYear[y] = averageSpeedFinedByYear[y] / countByYear[y];
    }

    const allYears: number[] = Array.from(
      new Set([...Object.keys(minimum_averageByYear), ...Object.keys(averageSpeedFinedByYear)].map(Number))
    ).sort((a, b) => a - b);

    const minimum_averageData = allYears.map(year => minimum_averageByYear[year] || 0);
    const regData = allYears.map(year => averageSpeedFinedByYear[year] || 0);

    console.log("Años:", allYears);
    console.log("Temperaturas mínimas:", minimum_averageData);
    console.log("Velocidad multada:", regData);


    renderChart(allYears, minimum_averageData, regData);
  }

  function renderChart(years: number[], minimum_averageData: number[], regData: number[]): void {
    // @ts-ignore
    Highcharts.chart('container', {
      chart: {
        polar: true
      },
      title: {
        text: 'Comparación de temperatura mínima vs media velocidad Multada'
      },
      subtitle: {
        text: 'Temperatura minima y velocidad media multada'
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
          name: 'Temperatura mínima (minimum_average)',
          data: minimum_averageData,
          pointPlacement: 'on'
        },
        {
          type: 'line',
          name: 'Media velocidad multada',
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
    Comparación  entre temperatura media en alguna provincia por año y media de velocidad multada por radares.
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
