<script context="module" lang="ts">
    // Si usas un bundler como Vite o Webpack, puedes importar Highcharts
    import Highcharts from 'highcharts';
    import heatmap from 'highcharts/modules/heatmap';
    import exporting from 'highcharts/modules/exporting';
    import exportData from 'highcharts/modules/export-data';
    import accessibility from 'highcharts/modules/accessibility';

    // Inicializar módulos
    heatmap(Highcharts);
    exporting(Highcharts);
    exportData(Highcharts);
    accessibility(Highcharts);
</script>

<svelte:head>
    <!-- Puedes omitir los <script> del CDN si lo importas desde npm -->
</svelte:head>

<style>
    .highcharts-figure {
        min-width: 310px;
        max-width: 900px;
        margin: 1em auto;
    }

    #container {
        height: 500px;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import type { TooltipFormatterContextObject } from "highcharts";

    interface WeatherData {
        city: string;
        dates: string[];
        temperatures: number[];
    }

    interface City {
        name: string;
        lat: number;
        lon: number;
    }

    const cities: City[] = [
        { name: "London", lat: 51.5074, lon: -0.1278 },
        { name: "New York", lat: 40.7128, lon: -74.0060 },
        { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        { name: "Sydney", lat: -33.8688, lon: 151.2093 }
    ];

    let weatherResults: WeatherData[] = [];

    const PROXY = "http://localhost:3000/proxy?url=";

    async function fetchWeather(city: City): Promise<WeatherData | null> {
        const baseURL = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max&timezone=auto`;
        const proxyURL = PROXY + encodeURIComponent(baseURL);

        try {
            const res = await fetch(proxyURL);
            const data = await res.json();

            return {
                city: city.name,
                dates: data.daily.time,
                temperatures: data.daily.temperature_2m_max
            };
        } catch (err) {
            console.error(`Error fetching weather for ${city.name}:`, err);
            return null;
        }
    }

    onMount(async () => {
        const results = await Promise.all(cities.map(fetchWeather));
        weatherResults = results.filter((r): r is WeatherData => r !== null);

        const dateLabels: string[] = weatherResults[0]?.dates || [];
        const heatmapData: [number, number, number][] = [];

        weatherResults.forEach((cityData, i) => {
            cityData.temperatures.forEach((temp: number, j: number) => {
                heatmapData.push([j, i, temp]);
            });
        });

        Highcharts.chart('container', {
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },
            title: {
                text: 'Temperatura máxima diaria por ciudad'
            },
            xAxis: {
                categories: dateLabels,
                title: { text: 'Día' }
            },
            yAxis: {
                categories: cities.map(c => c.name),
                title: { text: 'Ciudad' }
            },
            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors?.[0] ?? '#FF0000'
            },
            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },
            tooltip: {
                formatter: function (this: TooltipFormatterContextObject): string {
                    const city = cities[this.point?.y || 0]?.name;
                    const date = dateLabels[this.point?.x || 0];
                    const temp = this.point?.value as number;
                    return `<b>${city}</b><br>${date}: <b>${temp} °C</b>`;
                }
            },
            series: [{
                name: 'Temperatura máxima',
                borderWidth: 1,
                data: heatmapData,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }]
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>
