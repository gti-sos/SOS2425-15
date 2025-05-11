<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const localAPI = "https://sos2425-15.onrender.com/api/v1/ocupied-grand-stats/";
  const remoteAPI = "https://sos2425-14.onrender.com/api/v1/education-data";

  onMount(async () => {
    // Espera un poco para que Highcharts esté disponible
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const [localRes, remoteRes] = await Promise.all([
        fetch(localAPI),
        fetch(remoteAPI)
      ]);
      const localData = await localRes.json();
      const remoteData = await remoteRes.json();

      const groundByYear: Record<number, number> = {};
      const educationDataByYear: Record<number, number[]> = {};

      localData.forEach((entry: { year: string; ground: number }) => {
        const year = Number(entry.year);
        groundByYear[year] = (groundByYear[year] || 0) + (entry.ground || 0);
      });

      remoteData.forEach((entry: { year: number; basic_fp: number; middle_grade: number; higher_grade: number }) => {
        const { year, basic_fp, middle_grade, higher_grade } = entry;
        educationDataByYear[year] = [basic_fp || 0, middle_grade || 0, higher_grade || 0];
      });

      const allYears = Array.from(
        new Set([...Object.keys(groundByYear), ...Object.keys(educationDataByYear)].map(Number))
      ).sort((a, b) => a - b);

      const groundData = allYears.map(year => groundByYear[year] || 0);
      const educationData = allYears.map(year => educationDataByYear[year] || [0, 0, 0]);

      Highcharts.chart('container', {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Comparación de Ocupación de Suelo y Educación'
        },
        xAxis: {
          categories: allYears.map(String),
          title: {
            text: 'Año'
          }
        },
        yAxis: {
          title: {
            text: 'Valores'
          }
        },
        series: [
          { name: 'Suelo Ocupado', data: groundData },
          { name: 'FP Básica', data: educationData.map(d => d[0]) },
          { name: 'Grado Medio', data: educationData.map(d => d[1]) },
          { name: 'Grado Superior', data: educationData.map(d => d[2]) }
        ]
      });
    } catch (err) {
      console.error("Error al obtener o procesar los datos:", err);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="min-height: 400px;"></div>
  <p class="highcharts-description">
    Comparación entre superficie ocupada y datos educativos por año.
  </p>
</figure>

<style>
  .highcharts-figure {
    min-width: 320px;
    max-width: 800px;
    margin: 1em auto;
  }

  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>
