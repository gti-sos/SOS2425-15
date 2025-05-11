<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const studentsAPI = "https://sos2425-17.onrender.com/api/v2/students_satisfaction";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(studentsAPI);
      const data = await response.json();

      // Seleccionamos hasta 5 carreras diferentes
      const carreras = Array.from(new Set(data.map((item: any) => item.carrera))).slice(0, 5);
      const selectedData = carreras.map(carrera =>
        data.find((item: any) => item.carrera === carrera)
      );

      const seriesData = selectedData.map((entry: any) => ({
        name: entry.carrera,
        data: [
          parseFloat(entry.satisfaccion_total),
          parseFloat(entry.sat_estudiantes),
          parseFloat(entry.satisfaccion_pdi)
        ],
        pointPlacement: 'on'
      }));

      Highcharts.chart('container', {
        chart: {
          polar: true,
          type: 'line'
        },
        title: {
          text: 'Satisfacción por Carrera'
        },
        pane: {
          size: '80%'
        },
        xAxis: {
          categories: ['Satisfacción Total', 'Estudiantes', 'PDI'],
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0,
          max: 10
        },
        tooltip: {
          shared: true,
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
        },
        series: seriesData
      });

    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Comparativa de satisfacción total, de estudiantes y del profesorado por carrera (datos por radar).
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
