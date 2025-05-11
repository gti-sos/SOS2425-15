<script lang="ts">
  import { onMount } from 'svelte';
  import * as Plotly from 'plotly.js';

  const api = "https://sos2425-15.onrender.com/api/v1/precipitation-stats";

  onMount(async () => {
    const res = await fetch(api);
    const data = await res.json();

    const yearGroups: Record<string, number[]> = {};

    data.forEach((entry: any) => {
      const year = entry.year;
      const value = entry.historical_average;
      if (!yearGroups[year]) yearGroups[year] = [];
      if (value !== null && value !== undefined) {
        yearGroups[year].push(value);
      }
    });

    const traces: Partial<Plotly.PlotData>[] = Object.entries(yearGroups).map(([year, values]) => ({
      type: 'violin',
      y: values,
      name: year,
      box: { visible: true },
      line: { color: 'blue' },
      meanline: { visible: true }
    }));

    const layout = {
  title: { text: "Distribución de Promedios Históricos de Precipitación por Año" },
  yaxis: {
    zeroline: false,
    title: { text: 'Historical Average (mm)' }
  },
  violingap: 0,
  violinmode: 'overlay',
  height: 600
} as any;

</script>

<div id="container" style="width: 100%; max-width: 1000px; margin: auto;"></div>
