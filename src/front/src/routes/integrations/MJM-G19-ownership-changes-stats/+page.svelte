<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const apiURL = "https://sos2425-19.onrender.com/api/v1/ownership-changes-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      // Agrupar los datos por provincia y año
      const grouped: Record<string, Record<number, number>> = {};
      const allYears = new Set<number>();

      data.forEach((entry: any) => {
        const { province, year, ownership_changes } = entry;
        allYears.add(year);
        if (!grouped[province]) grouped[province] = {};
        grouped[province][year] = (grouped[province][year] || 0) + (ownership_changes || 0);
      });

      const sortedYears = Array.from(allYears).sort((a, b) => a - b);

      const series = Object.entries(grouped).map(([province, yearData]) => ({
        name: province,
        data: sortedYears.map(year => yearData[year] || 0)
      }));

      Highcharts.chart('container', {
        chart: {
          type: 'area'
        },
        title: {
          text: 'Cambios de titularidad por provincia y año'
        },
        xAxis: {
          categories: sortedYears,
          tickmarkPlacement: 'on',
          title: { text: 'Año' }
        },
        yAxis: {
          title: { text: 'Cambios de titularidad' }
        },
        tooltip: {
          split: true,
          valueSuffix: ' cambios'
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
        series
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de áreas apiladas que muestra los cambios de titularidad en distintas provincias a lo largo del tiempo.
  </p>
</figure>

<style>
  .highcharts-figure {
    max-width: 900px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>
