<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const uniAPI = "https://sos2425-17.onrender.com/api/v1/university-academic-perfomance";
  const rainAPI = "https://sos2425-15.onrender.com/api/v1/precipitation-stats";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const [uniRes, rainRes] = await Promise.all([
        fetch(uniAPI),
        fetch(rainAPI)
      ]);

      const uniData = await uniRes.json();
      const rainData = await rainRes.json();

      // Agrupamos precipitación por provincia (usamos promedio si hay varios años)
      const rainMap: Record<string, number[]> = {};
      rainData.forEach((entry: any) => {
        const province = entry.province;
        if (!rainMap[province]) rainMap[province] = [];
        rainMap[province].push(entry.precipitation || 0);
      });

      const avgRain: Record<string, number> = {};
      for (const province in rainMap) {
        const values = rainMap[province];
        avgRain[province] = values.reduce((a, b) => a + b, 0) / values.length;
      }

      // Combinar universidades con precipitación
      const scatterData: any[] = [];

      uniData.forEach((uni: any) => {
        const loc = uni.location;
        const rain = avgRain[loc]; // location debe coincidir con 'province'
        const score = uni.average_score;

        if (rain !== undefined && score !== undefined) {
          scatterData.push({
            name: uni.university,
            x: rain,
            y: score
          });
        }
      });

      Highcharts.chart('container', {
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: 'Rendimiento académico vs Precipitación por universidad'
        },
        xAxis: {
          title: {
            text: 'Precipitación media (mm)'
          }
        },
        yAxis: {
          title: {
            text: 'Nota media'
          }
        },
        tooltip: {
          pointFormat: '<b>{point.name}</b><br>Precipitación: {point.x} mm<br>Nota media: {point.y}'
        },
        series: [{
          name: 'Universidades',
          color: 'rgba(223, 83, 83, .5)',
          data: scatterData
        }]
      });
    } catch (error) {
      console.error("Error al cargar o procesar datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 550px;"></div>
  <p class="highcharts-description">
    Gráfico de dispersión que muestra la relación entre la nota media universitaria y la precipitación media en su ubicación.
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
