<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/variable-pie.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const spacexAPI = "https://api.spacexdata.com/v4/launches";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(spacexAPI);
      const launches = await response.json();

      const grouped: Record<string, { total: number; success: number }> = {};

      launches.forEach((launch: any) => {
        const rocket = launch.rocket || 'Unknown';
        const success = launch.success === true;

        if (!grouped[rocket]) {
          grouped[rocket] = { total: 0, success: 0 };
        }
        grouped[rocket].total += 1;
        if (success) grouped[rocket].success += 1;
      });

      // Obtener nombres reales de los cohetes
      const rocketsResp = await fetch('https://api.spacexdata.com/v4/rockets');
      const rockets = await rocketsResp.json();
      const rocketNames: Record<string, string> = {};
      rockets.forEach((r: any) => rocketNames[r.id] = r.name);

      const pieData = Object.entries(grouped).map(([rocketId, stats]) => {
        const name = rocketNames[rocketId] || rocketId;
        const successRate = (stats.success / stats.total) * 100;

        return {
          name,
          y: stats.total,
          z: successRate
        };
      });

      Highcharts.chart('container', {
        chart: {
          type: 'variablepie'
        },
        title: {
          text: 'Lanzamientos por tipo de cohete (SpaceX)'
        },
        tooltip: {
          headerFormat: '',
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
            'Lanzamientos: <b>{point.y}</b><br/>' +
            'Éxito: <b>{point.z:.1f}%</b><br/>'
        },
        series: [{
          minPointSize: 10,
          innerSize: '20%',
          zMin: 0,
          name: 'Cohetes',
          data: pieData
        }]
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 600px;"></div>
  <p class="highcharts-description">
    Gráfico de pastel con radios variables que muestra el número de lanzamientos y la tasa de éxito por tipo de cohete de SpaceX.
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