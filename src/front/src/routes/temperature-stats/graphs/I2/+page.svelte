<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  let chart: Chart | null = null;

  const apiURL = 'https://sos2425-15.onrender.com/api/v1/temperature-stats/';

  onMount(async () => {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      // Agrupamos por país y obtenemos temperaturas medias
      const filtered = data.filter((item: any) => item.average_temperature && item.province);
      const sorted = filtered.slice(0, 10); // Tomamos 10 primeros para simplificar

      const labels = sorted.map((d: any) => d.province + " (" + d.year + ")");
      const values = sorted.map((d: any) => d.average_temperature);

      const ctx = (document.getElementById('tempChart') as HTMLCanvasElement).getContext('2d');
      if (chart) chart.destroy();

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Temperatura Media (°C)',
            data: values,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Temperatura Media por País (datos de la API SOS2425)'
            }
          }
        }
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });
</script>

<figure style="max-width: 800px; margin: auto;">
  <canvas id="tempChart" width="800" height="400"></canvas>
  <p style="text-align: center; margin-top: 1rem;">
    Gráfico de líneas que muestra la temperatura media registrada por país según la API SOS2425.
  </p>
</figure>