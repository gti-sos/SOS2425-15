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
    await new Promise(resolve => setTimeout(resolve, 500));

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



