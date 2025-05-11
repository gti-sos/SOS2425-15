<!DOCTYPE html>
<html>
<head>
    <title>JokeAPI Pyramid Chart</title>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/funnel.js"></script>
</head>
<body>
    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        // Función para obtener chistes de la API
        async function fetchJokes() {
            const response = await fetch('https://v2.jokeapi.dev/joke/Any?amount=5');
            const data = await response.json();
            return data.jokes.map((joke, index) => {
                const jokeText = joke.type === 'single' ? joke.joke : joke.setup + ' ' + joke.delivery;
                return [jokeText, 100 - index * 20]; // Asignar valores decrecientes
            });
        }

        // Función para renderizar la gráfica
        async function renderChart() {
            const jokesData = await fetchJokes();

            Highcharts.chart('container', {
                chart: {
                    type: 'pyramid'
                },
                title: {
                    text: 'Top 5 Chistes de JokeAPI'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y})',
                            color: 'black',
                            softConnector: true
                        },
                        center: ['40%', '50%'],
                        width: '80%'
                    }
                },
                series: [{
                    name: 'Chistes',
                    data: jokesData
                }]
            });
        }

        // Llamar a la función para renderizar la gráfica
        renderChart();
    </script>
</body>
</html>

