<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const cyberAPI = "https://sos2425-14.onrender.com/api/v1/cybercrime-data";
  const rainAPI = "https://sos2425-15.onrender.com/api/v1/precipitation-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const [cyberResponse, rainResponse] = await Promise.all([
        fetch(cyberAPI),
        fetch(rainAPI)
      ]);

      const cyberData = await cyberResponse.json();
      const rainData = await rainResponse.json();

      const targetYear = 2022;

      // Agrupar datos por provincia
      const cyberMap: Record<string, number> = {};
      cyberData.forEach((entry: any) => {
        if (entry.year === targetYear) {
          cyberMap[entry.province] = entry.total_cybercrimes || 0;
        }
      });

      const rainMap: Record<string, number> = {};
      rainData.forEach((entry: any) => {
        if (entry.year === targetYear) {
          rainMap[entry.province] = entry.precipitation || 0;
        }
      });

      // Obtener provincias comunes
      const provinces = Array.from(new Set([
        ...Object.keys(cyberMap),
        ...Object.keys(rainMap)
      ])).sort();

      const cyberValues = provinces.map(prov => cyberMap[prov] || 0);
      const rainValues = provinces.map(prov => rainMap[prov] || 0);

      Highcharts.chart('container', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Cibercrimen vs. Precipitación por Provincia (2022)'
        },
        xAxis: {
          categories: provinces,
          crosshair: true,
          title: { text: 'Provincia' }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Cantidad (crímenes / mm de lluvia)'
          }
        },
        tooltip: {
          shared: true
        },
        plotOptions: {
          column: {
            grouping: true,
            shadow: false
          }
        },
        series: [
          {
            name: 'Cibercrímenes',
            data: cyberValues
          },
          {
            name: 'Precipitación (mm)',
            data: rainValues
          }
        ]
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px;"></div>
  <p class="highcharts-description">
    Gráfico de columnas agrupadas que compara el número de cibercrímenes y la cantidad de precipitación por provincia en 2022.
  </p>
</figure>

<style>
  .highcharts-figure {
    max-width: 950px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>
