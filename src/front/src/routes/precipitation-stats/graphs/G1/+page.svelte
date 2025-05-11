<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const precipitationAPI = "https://sos2425-15.onrender.com/api/v1/precipitation-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(precipitationAPI);
      const data = await response.json();

      // Agrupar por provincia y sumar historical_average
      const grouped: Record<string, number> = {};

      data.forEach((entry: any) => {
        const province = entry.province || "Desconocido";
        const avg = parseFloat(entry.historical_average) || 0;
        if (!grouped[province]) {
          grouped[province] = 0;
        }
        grouped[province] += avg;
      });

      const pieData = Object.entries(grouped).map(([province, avg]) => ({
        name: province,
        y: avg
      }));

      Highcharts.chart('container', {
        chart: { type: 'pie' },
        title: { text: 'Promedio histórico de precipitación por provincia' },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b> mm ({point.percentage:.1f}%)'
        },
        accessibility: {
          point: { valueSuffix: '%' }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Precipitación (mm)',
          colorByPoint: true,
          data: pieData
        }]
      });

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de pastel que muestra el promedio histórico de precipitación por provincia.
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
