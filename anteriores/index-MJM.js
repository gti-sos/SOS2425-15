





const precipitation_stats = [
    { year: 2020, province: "Sevilla", annual_precipitation: 210.6, historical_average: 292.9, deviation: -82.4 },
    { year: 2020, province: "Cádiz", annual_precipitation: 578.6, historical_average: 722.9, deviation: -144.3 },
    { year: 2020, province: "Córdoba", annual_precipitation: 450.2, historical_average: 557.9, deviation: -107.7 },
    { year: 2020, province: "Granada", annual_precipitation: 344.5, historical_average: 430.5, deviation: -86 },
    { year: 2020, province: "Huelva", annual_precipitation: 617.5, historical_average: 644.6, deviation: -27.1 },
    { year: 2020, province: "Jaén", annual_precipitation: 411.3, historical_average: 549.4, deviation: -138 },
    { year: 2020, province: "Almería", annual_precipitation: 210.6, historical_average: 292.9, deviation: -82.4 },
    { year: 2020, province: "Sevilla", annual_precipitation: 472, historical_average: 559.7, deviation: -87.7 },
    { year: 2021, province: "Sevilla", annual_precipitation: 440.7, historical_average: 559.7, deviation: -119 },
    { year: 2022, province: "Sevilla", annual_precipitation: 451.8, historical_average: 559.7, deviation: -107.9 },
    { year: 2021, province: "Cádiz", annual_precipitation: 568.5, historical_average: 722.9, deviation: -154.3 },
    { year: 2021, province: "Córdoba", annual_precipitation: 433.4, historical_average: 557.9, deviation: -124.5 },
    { year: 2021, province: "Granada", annual_precipitation: 309, historical_average: 430.5, deviation: -121.5 },
    { year: 2021, province: "Huelva", annual_precipitation: 484, historical_average: 644.6, deviation: -160.6 },
    { year: 2021, province: "Jaén", annual_precipitation: 432.3, historical_average: 549.4, deviation: -117.1 },
    { year: 2022, province: "Málaga", annual_precipitation: 580.4, historical_average: 628.4, deviation: -47.9 },
    { year: 2022, province: "Cádiz", annual_precipitation: 639.2, historical_average: 722.9, deviation: -83.7 },
    { year: 2022, province: "Córdoba", annual_precipitation: 441.2, historical_average: 557.9, deviation: -116.7 },
    { year: 2022, province: "Granada", annual_precipitation: 372.7, historical_average: 430.5, deviation: -57.8 }
];





/*function mediaAcumulaciones(ejemplos){
    conteo= 0;
    sumaPrecipitaciones = 0;
    ejemplos.forEach(x => {
        sumaPrecipitaciones += parseFloat(x.annual_precipitation);
        conteo += 1;
    });
    return sumaPrecipitaciones/conteo;
}

console.log("La media de precipitaciones acumuladas es: ",mediaAcumulaciones(precipitation_stats));*/


export{precipitation_stats}









