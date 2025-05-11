<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/heatmap.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from "svelte";

  const landAPI = "https://sos2425-15.onrender.com/api/v1/ocupied-grand-stats/";
  const eduAPI = "https://sos2425-14.onrender.com/api/v1/education-data/";

  // Interfaces para datos
  interface LandEntry {
    ine_code: number;
    year: number;
    province: string;
    ground: number;
    grass: number;
    wooded: number;
    non_agrarian_surface: number;
  }

  interface EduEntry {
    autonomous_community: string;
    basic_fp: number;
    middle_grade: number;
    higher_grade: number;
    year: number;
  }

  onMount(async () => {
    const Highcharts = (window as any).Highcharts;

    try {
      const [landRes, eduRes] = await Promise.all([
        fetch(landAPI),
        fetch(eduAPI)
      ]);

      const landData: LandEntry[] = await landRes.json();
      const eduData: EduEntry[] = await eduRes.json();

      const andaluciaProvinces = [
        "sevilla", "cordoba", "granada", "cadiz", "almería",
        "jaén", "huelva", "málaga"
      ];

      const filteredLand: LandEntry[] = landData.filter(
        (d: LandEntry) =>
          andaluciaProvinces.includes(d.province.toLowerCase())
      );

      const andaluciaEdu: EduEntry | undefined = eduData.find(
        (d: EduEntry) =>
          d.autonomous_community.toLowerCase() === "andalucia"
      );

      const educationLevels = ["basic_fp", "middle_grade", "higher_grade"];

      const heatmapData: [number, number, number][] = [];

      filteredLand.forEach((prov: LandEntry, i: number) => {
        educationLevels.forEach((level: string, j: number) => {
          const levelValue = (andaluciaEdu as any)[level] ?? 0;
          heatmapData.push([j, i, Math.round(prov.ground * levelValue)]);
        });
      });

      Highcharts.chart("container", {
        chart: {
          type: "heatmap",
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1
        },
        title: {
          text: "Superficie ocupada vs Niveles de FP (Andalucía)"
        },
        xAxis: {
          categories: ["FP Básica", "Grado Medio", "Grado Superior"],
          title: { text: "Nivel de Formación Profesional" }
        },
        yAxis: {
          categories: filteredLand.map((d) => d.province),
          title: { text: "Provincia" }
        },
        colorAxis: {
          min: 0,
          minColor: "#FFFFFF",
          maxColor: "#006837"
        },
        legend: {
          align: "right",
          layout: "vertical",
          margin: 0,
          verticalAlign: "top",
          y: 25,
          symbolHeight: 280
        },
        tooltip: {
          formatter: function () {
            return `<b>${this.series.yAxis.categories[this.point.y]}</b><br>
                    ${this.series.xAxis.categories[this.point.x]}<br>
                    Valor: <b>${Math.round(this.point.value)}</b>`;
          }
        },
        series: [
          {
            name: "Superficie ocupada x Nivel FP",
            borderWidth: 1,
            data: heatmapData,
            dataLabels: {
              enabled: true,
              color: "#000000"
            }
          }
        ]
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 500px; max-width: 900px; margin: auto"></div>
  <p class="highcharts-description" style="text-align: center;">
    Mapa de calor que relaciona el uso del suelo con niveles de formación profesional en provincias de Andalucía.
  </p>
</figure>
