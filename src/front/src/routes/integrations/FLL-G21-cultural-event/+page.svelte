<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const culturalAPI = "https://sos2425-21.onrender.com/api/v1/cultural-event";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const res = await fetch(culturalAPI);
      const data = await res.json();

      // Agrupar por año sumando asistencias
      const attendanceByYear: Record<number, { local: number, foreign: number }> = {};

      data.forEach((item: any) => {
        if (!attendanceByYear[item.year]) {
          attendanceByYear[item.year] = { local: 0, foreign: 0 };
        }
        attendanceByYear[item.year].local += item.local_attendance;
        attendanceByYear[item.year].foreign += item.foreign_attendance;
      });

      const years = Object.keys(attendanceByYear).sort();
      const localData = years.map(year => attendanceByYear[+year].local);
      const foreignData = years.map(year => attendanceByYear[+year].foreign);

      Highcharts.chart('container', {
        chart: {
          type: 'area'
        },
        title: {
          text: 'Evolución de la asistencia a eventos culturales'
        },
        xAxis: {
          categories: years,
          tickmarkPlacement: 'on',
          title: {
            text: 'Año'
          }
        },
        yAxis: {
          title: {
            text: 'Número de asistentes'
          }
        },
        tooltip: {
          split: true,
          valueSuffix: ' asistentes'
        },
        plotOptions: {
          area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
              lineWidth: 1,
              lineColor: '#666666'
            }
          }
        },
        series: [
          {
            name: 'Asistencia Local',
            data: localData
          },
          {
            name: 'Asistencia Extranjera',
            data: foreignData
          }
        ]
      });

    } catch (error) {
      console.error("Error al cargar los datos de eventos culturales:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Asistencia acumulada (local y extranjera) a eventos culturales por año.
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
