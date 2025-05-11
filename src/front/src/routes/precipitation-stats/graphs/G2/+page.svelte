<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  const apiUrl = "https://sos2425-15.onrender.com/api/v1/precipitation-stats";
  let chart: Chart | null = null;

  onMount(async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      // Agrupar por comunidad autónoma y sumar la precipitación total
      const grouped: Record<string, number> = {};
      data.forEach((entry: any) => {
        const region = entry["autonomous_community"];
        const precipitation = entry["annual_avg_precipitation"] || 0;

        if (!grouped[region]) {
          grouped[region] = 0;
        }
        grouped[region] += precipitation;
      });

      const labels = Object.keys(grouped);
      const values = Object.values(grouped);

      const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        chart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels,
            datasets: [{
              label: 'Precipitación anual por comunidad',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Precipitación anual promedio por comunidad autónoma'
              }
            },
            scales: {
              r: {
                angleLines: {
                  display: true
                },
                suggestedMin: 0
              }
            }
          }
        });
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  });
</script>

<figure class="chart-figure">
  <canvas id="myChart" width="400" height="400"></canvas>
  <p class="chart-description">
    Gráfico radar que representa la precipitación media anual en distintas comunidades autónomas.
  </p>
</figure>

<style>
  .chart-figure {
    max-width: 800px;
    margin: auto;
  }
  .chart-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>
