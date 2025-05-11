<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/sunburst.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const countriesAPI = "https://restcountries.com/v3.1/all";

  type SunburstNode = {
    id: string;
    parent?: string;
    name: string;
    value?: number;
  };

  onMount(async () => {
    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(countriesAPI);
      const countries = await response.json();

      const data: SunburstNode[] = [];
      const continents = new Set<string>();
      const subregions = new Set<string>();

      countries.forEach((country: any) => {
        const continent = country.region || 'Other';
        const subregion = country.subregion || 'Other';
        const countryName = country.name?.common;
        const population = country.population || 0;

        if (!continent || !subregion || !countryName) return;

        continents.add(continent);
        subregions.add(`${continent}-${subregion}`);

        data.push({
          id: countryName,
          parent: `${continent}-${subregion}`,
          name: countryName,
          value: population
        });
      });

      continents.forEach((continent) => {
        data.push({
          id: continent,
          parent: '',
          name: continent
        });
      });

      subregions.forEach((subregionCombo) => {
        const [continent, subregion] = subregionCombo.split('-');
        data.push({
          id: subregionCombo,
          parent: continent,
          name: subregion
        });
      });

      Highcharts.chart('container', {
        chart: {
          height: '100%'
        },
        title: {
          text: 'Distribución de países por continente y subregión'
        },
        series: [{
          type: "sunburst",
          data: data,
          allowDrillToNode: true,
          cursor: 'pointer',
          dataLabels: {
            format: '{point.name}',
            filter: {
              property: 'innerArcLength',
              operator: '>',
              value: 16
            }
          },
          levels: [{
            level: 1,
            colorByPoint: true,
            dataLabels: {
              rotationMode: 'parallel'
            }
          }, {
            level: 2,
            colorByPoint: true,
            dataLabels: {
              rotationMode: 'parallel'
            }
          }, {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5
            }
          }]
        }],
        tooltip: {
          headerFormat: "",
          pointFormat: '<b>{point.name}</b>: {point.value} habitantes'
        }
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 600px;"></div>
  <p class="highcharts-description">
    Gráfico de sol que muestra la jerarquía de continentes, subregiones y países, con el tamaño representando la población.
  </p>
</figure>

<style>
  .highcharts-figure {
    max-width: 1000px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
  }
</style>





