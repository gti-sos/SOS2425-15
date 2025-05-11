<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const homeStatsAPI = "https://sos2425-21.onrender.com/api/v1/home-buying-selling-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(homeStatsAPI);
      const data = await response.json();

      // Agrupar por provincia (suma de viviendas compradas)
      const grouped: Record<string, number> = {};

      data.forEach((entry: any) => {
        const province = entry.province;
        const bought = entry.transaction_new_housing || 0;
        if (!grouped[province]) {
          grouped[province] = 0;
        }
        grouped[province] += bought;
      });

      const pieData = Object.entries(grouped).map(([province, totalBought]) => ({
        name: province,
        y: totalBought
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Distribución de viviendas compradas por provincia'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
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
          name: 'Compras',
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
    Gráfico de pastel que muestra la proporción de viviendas compradas por provincia.
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
