<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';

  const coinsAPI = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const Highcharts = (window as any).Highcharts;
    if (!Highcharts) {
      console.error("Highcharts no está disponible");
      return;
    }

    try {
      const response = await fetch(coinsAPI);
      const coins = await response.json();

      const coinNames = coins.map((coin: any) => coin.name);
      const marketCaps = coins.map((coin: any) => coin.market_cap);

      Highcharts.chart('container', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Top 10 Criptomonedas por Capitalización de Mercado'
        },
        xAxis: {
          categories: coinNames,
          title: {
            text: 'Criptomoneda'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Capitalización de Mercado (USD)'
          },
          labels: {
            formatter: function () {
              return `$${(this.value / 1e9).toFixed(1)}B`;
            }
          }
        },
        tooltip: {
          pointFormat: '<b>{point.y:,.0f} USD</b>'
        },
        series: [{
          name: 'Market Cap',
          data: marketCaps
        }]
      });
    } catch (error) {
      console.error("Error cargando datos de CoinGecko:", error);
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 600px;"></div>
  <p class="highcharts-description">
    Gráfico de columnas mostrando la capitalización de mercado de las 10 principales criptomonedas.
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