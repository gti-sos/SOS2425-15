<script lang="ts">
  import { onMount } from 'svelte';

  const homeStatsAPI = "/proxy/home-buying";
  const precipitationAPI = "/proxy/precipitation";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const [homeRes, precipRes] = await Promise.all([
        fetch(homeStatsAPI),
        fetch(precipitationAPI)
      ]);

      const homeData = await homeRes.json();
      const precipData = await precipRes.json();

      // Procesar datos: por ejemplo, combinar por provincia o año
      const combined: Record<string, { bought: number, precip: number }> = {};

      homeData.forEach((entry: any) => {
        const key = entry.province;
        if (!combined[key]) combined[key] = { bought: 0, precip: 0 };
        combined[key].bought += entry.transaction_new_housing || 0;
      });

      precipData.forEach((entry: any) => {
        const key = entry.province || entry.country || "Desconocido";
        if (!combined[key]) combined[key] = { bought: 0, precip: 0 };
        combined[key].precip += entry.precipitation_mm || 0;
      });

      // Datos para gráfico de columnas combinadas
      const categories = Object.keys(combined);
      const seriesBought = categories.map(k => combined[k].bought);
      const seriesPrecip = categories.map(k => combined[k].precip);

      Highcharts.chart('container', {
        chart: { type: 'column' },
        title: {
          text: 'Viviendas compradas vs Precipitación por provincia'
        },
        xAxis: {
          categories,
          crosshair: true
        },
        yAxis: [{
          title: { text: 'Viviendas Compradas' }
        }, {
          title: { text: 'Precipitación (mm)' },
          opposite: true
        }],
        tooltip: {
          shared: true
        },
        series: [
          {
            name: 'Viviendas Compradas',
            type: 'column',
            data: seriesBought,
            yAxis: 0
          },
          {
            name: 'Precipitación (mm)',
            type: 'column',
            data: seriesPrecip,
            yAxis: 1
          }
        ]
      });

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

