<svelte:head>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script lang="ts">
  // Importar onMount de Svelte y Highcharts
  import { onMount } from 'svelte';
  import Highcharts from 'highcharts';

  // URLs de las APIs
  const accidentAPI = "https://sos2425-15.onrender.com/accidents-stats";
  const precipitationAPI = "https://sos2425-15.onrender.com/precipititation-stats";

  interface AccidentEntry {
    year: number;
    total_accidents: number;
  }

  interface PrecipitationEntry {
    year: number;
    total_precipitation: number;
  }

  async function fetchAndProcessData() {
    try {
      const [accidentsRes, precipitationRes] = await Promise.all([
        fetch(accidentAPI),
        fetch(precipitationAPI)
      ]);

      const accidentData: AccidentEntry[] = await accidentsRes.json();
      const precipitationData: PrecipitationEntry[] = await precipitationRes.json();

      // Agrupar por año y sumar los totales
      const accidentsByYear: Record<number, number> = {};
      const precipitationByYear: Record<number, number> = {};

      accidentData.forEach(entry => {
        const year = Number(entry.year);
        const total = Number(entry.total_accidents) || 0;
        if (!isNaN(year)) {
          accidentsByYear[year] = (accidentsByYear[year] || 0) + total;
        }
      });

      precipitationData.forEach(entry => {
        const year = Number(entry.year);
        const total = Number(entry.total_precipitation) || 0;
        if (!isNaN(year)) {
          precipitationByYear[year] = (precipitationByYear[year] || 0) + total;
        }
      });

      const years: number[] = Array.from(new Set([
        ...Object.keys(accidentsByYear),
        ...Object.keys(precipitationByYear)
      ].map(Number))).sort((a, b) => a - b);

      const accidentSeries: number[] = years.map(year => accidentsByYear[year] || 0);
      const precipSeries: number[] = years.map(year => precipitationByYear[year] || 0);

      renderChart(years, accidentSeries, precipSeries);

    } catch (error) {
      console.error("Error fetching or processing data", error);
    }
  }

  function renderChart(years: number[], accidents: number[], precipitation: number[]) {
    Highcharts.chart('container', {
      chart: {
        polar: true
      },
      title: {
        text: 'Accidentes de tráfico vs Precipitaciones'
      },
      subtitle: {
        text: 'Comparación por año'
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
      series: [{
        type: 'line',
        name: 'Total de Accidentes',
        data: accidents,
        pointPlacement: 'on'
      }, {
        type: 'line',
        name: 'Total de Precipitaciones',
        data: precipitation,
        pointPlacement: 'on'
      }]
    });
  }

  // Llamar a fetchAndProcessData al montar el componente
  onMount(() => {
    fetchAndProcessData();
  });
</script>

<figure class="highcharts-figure">
  <div id="container"></div>
  <p class="highcharts-description">
    Gráfico polar que compara el total de accidentes de tráfico y precipitaciones por año.
  </p>
</figure>

<style>
  .highcharts-figure,
  .highcharts-data-table table {
    min-width: 320px;
    max-width: 660px;
    margin: 1em auto;
  }

  .highcharts-description {
    margin: 0.5rem 1rem;
    text-align: center;
  }
</style>


