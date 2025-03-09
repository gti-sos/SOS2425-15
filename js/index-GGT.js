let concatList = [
    {year: "2020", province: "Almería", average_temperature: "16.2", minimum_average: "11.2", maximum_average: "21.9"},
    {year: "2020", province: "Cádiz", average_temperature: "18.0", minimum_average: "13.1", maximum_average: "23.6"},
    {year: "2020", province: "Córdoba", average_temperature: "17.3", minimum_average: "11.0", maximum_average: "23.9"},
    {year: "2020", province: "Granada", average_temperature: "14.5", minimum_average: "8.7", maximum_average: "20.9"},
    {year: "2020", province: "Huelva", average_temperature: "17.9", minimum_average: "12.1", maximum_average: "24.1"},
    {year: "2020", province: "Jaén", average_temperature: "16.3", minimum_average: "10.3", maximum_average: "22.9"},
    {year: "2020", province: "Málaga", average_temperature: "17.0", minimum_average: "12.2", maximum_average: "22.4"},
    {year: "2020", province: "Sevilla", average_temperature: "18.2", minimum_average: "12.1", maximum_average: "24.8"},
    {year: "2021", province: "Almería", average_temperature: "16.1", minimum_average: "11.2", maximum_average: "21.6"},
    {year: "2021", province: "Cádiz", average_temperature: "17.8", minimum_average: "13.0", maximum_average: "23.2"},
    {year: "2021", province: "Córdoba", average_temperature: "17.0", minimum_average: "10.6", maximum_average: "23.7"},
    {year: "2021", province: "Granada", average_temperature: "14.2", minimum_average: "8.4", maximum_average: "20.4"},
    {year: "2021", province: "Huelva", average_temperature: "17.5", minimum_average: "11.6", maximum_average: "23.9"},
    {year: "2021", province: "Jaén", average_temperature: "16.1", minimum_average: "9.9", maximum_average: "22.5"},
    {year: "2021", province: "Málaga", average_temperature: "17.1", minimum_average: "12.2", maximum_average: "22.4"},
    {year: "2021", province: "Sevilla", average_temperature: "18.0", minimum_average: "11.8", maximum_average: "24.7"},
    {year: "2022", province: "Almería", average_temperature: "16.9", minimum_average: "11.7", maximum_average: "22.6"},
    {year: "2022", province: "Cádiz", average_temperature: "18.7", minimum_average: "13.7", maximum_average: "24.2"},
    {year: "2022", province: "Córdoba", average_temperature: "18.0", minimum_average: "11.3", maximum_average: "24.8"},
    {year: "2022", province: "Granada", average_temperature: "15.4", minimum_average: "9.4", maximum_average: "21.9"},
    {year: "2022", province: "Huelva", average_temperature: "18.3", minimum_average: "12.3", maximum_average: "24.8"},
    {year: "2022", province: "Jaén", average_temperature: "17.1", minimum_average: "10.9", maximum_average: "23.7"},
    {year: "2022", province: "Málaga", average_temperature: "17.9", minimum_average: "13.0", maximum_average: "23.3"},
    {year: "2022", province: "Sevilla", average_temperature: "18.7", minimum_average: "12.4", maximum_average: "25.6"},
    {year: "2023", province: "Almería", average_temperature: "17.1", minimum_average: "11.7", maximum_average: "23.0"},
    {year: "2023", province: "Cádiz", average_temperature: "18.6", minimum_average: "13.4", maximum_average: "24.5"},
    {year: "2023", province: "Córdoba", average_temperature: "17.8", minimum_average: "11.0", maximum_average: "24.8"},
    {year: "2023", province: "Granada", average_temperature: "15.3", minimum_average: "9.1", maximum_average: "21.9"},
    {year: "2023", province: "Huelva", average_temperature: "18.5", minimum_average: "12.3", maximum_average: "25.2"},
    {year: "2023", province: "Jaén", average_temperature: "17.0", minimum_average: "10.5", maximum_average: "23.8"},
    {year: "2023", province: "Málaga", average_temperature: "18.0", minimum_average: "12.9", maximum_average: "23.7"},
    {year: "2023", province: "Sevilla", average_temperature: "18.8", minimum_average: "12.1", maximum_average: "25.9"}
];

function mediaTotalConjunta(datos){
    cantidad = 0;
    sumaTemperaturas = 0;
    datos.forEach(element => {
        sumaTemperaturas += parseFloat(element.average_temperature);
        cantidad += 1;
    });
    return sumaTemperaturas/cantidad;
}

console.log(mediaTotalConjunta(concatList));