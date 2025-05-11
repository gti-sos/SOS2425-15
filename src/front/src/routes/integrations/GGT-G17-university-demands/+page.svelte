<script lang="ts">
  import { onMount } from 'svelte';

  const sanctionsAPI = "https://sos2425-17.onrender.com/api/v2/university-demands";
  const initAPI = "https://sos2425-17.onrender.com/api/v2/university-demands/loadInitialData";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;

    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      // 1. Ejecutar la carga de datos inicial
      await fetch(initAPI);

      // 2. Obtener los datos de la API
      const response = await fetch(sanctionsAPI);
      const data = await response.json();

      const graduatedlocation: Record<string, number> = {};

      data.forEach((entry: any) => {
        const location = entry.location;
        const graduated = entry.graduated || 0;

        if (graduatedlocation[location]) {
          graduatedlocation[location] = Math.max(graduatedlocation[location], graduated);
        } else {
          graduatedlocation[location] = graduated;
        }
      });

      const location = Object.keys(graduatedlocation);
      const universityData = Object.values(graduatedlocation);  

      Highcharts.chart('container', {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Graduados por localidad'
        },
        xAxis: {
          categories: location,
          crosshair: true,
          accessibility: {
            description: 'localidad'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Graduados'
          }
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
          name: 'Graduados',
          data: universityData
        }]
      });

    } catch (error) {
      console.error("Error al obtener o cargar datos:", error);
    }
  });
</script>