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

  // Usamos 'window as any' para evitar el error de tipo
  const Highcharts = (window as any).Highcharts;

  const localAPI = "https://sos2425-15.onrender.com/api/v1/ocupied-grand-stats/";
  const remoteAPI = "https://sos2425-14.onrender.com/api/v1/education-data";

  async function fetchAndProcessData(): Promise<void> {
    const [localRes, remoteRes] = await Promise.all([
      fetch(localAPI),
      fetch(remoteAPI)
    ]);
    const localData = await localRes.json();
    const remoteData = await remoteRes.json();

    // Tipar correctamente los objetos
    const groundByYear: Record<number, number> = {};
    const educationDataByYear: Record<number, number[]> = {};

    // Procesamos los datos de la API de ocupación de suelo
    localData.forEach((entry: { year: string, ground: number }) => {
      const year = Number(entry.year);
      const ground = entry.ground || 0;
      groundByYear[year] = (groundByYear[year] || 0) + ground;
    });

    // Procesamos los datos de la API de educación
    remoteData.forEach((entry: { year: number, basic_fp: number, middle_grade: number, higher_grade: number }) => {
      const year = entry.year;
      const { basic_fp, middle_grade, higher_grade } = entry;
      if (!educationDataByYear[year]) {
        educationDataByYear[year] = [];
      }
      educationDataByYear[year].push(basic_fp, middle_grade, higher_grade);
    });

    const allYears: number[] = Array.from(
      new Set([
        ...Object.keys(groundByYear).map(Number),
        ...Object.keys(educationDataByYear).map(Number)
      ])
    ).sort((a, b) => a - b);

    const groundData = allYears.map(year => groundByYear[year] || 0);
    const educationData = allYears.map(year => educationDataByYear[year] || [0, 0, 0]);

    renderChart(allYears, groundData, educationData);
  }

  function renderChart(years: number[], groundData: number[], educationData: number[][]): void {
    Highcharts.chart('container', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Comparación de Ocupación de Suelo y Datos de Educación por Año'
      },
      subtitle: {
        text: 'Datos de Suelo Ocupado vs FP y Educación Superior por Año'
      },
      xAxis: {
        categories: years.map(String),
        title: {
          text: 'Año'
        }
      },
      yAxis: {
        title: {
          text: 'Valor'
        }
      },
      series: [
        {
          name: 'Suelo Ocupado',
          data: groundData
        },
        {
          name: 'FP Básica',
          data: educationData.map(data => data[0])  // FP básica
        },
        {
          name: 'Grado Medio',
          data: educationData.map(data => data[1])  // Grado Medio
        },
        {
          name: 'Grado Superior',
          data: educationData.map(data => data[2])  // Grado Superior
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
    Comparación entre la superficie ocupada y los datos educativos por año.
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
