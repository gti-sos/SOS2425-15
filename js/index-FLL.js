let surfaceData = [
    {year: "2021", province: "cadiz", ground: 177000, grass: 300000, wooded: 250000, non_agrarian_surface: 70000},
    {year: "2021", province: "almería", ground: 177590, grass: 363915, wooded: 257241, non_agrarian_surface: 78557},
    {year: "2021", province: "cordoba", ground: 728625, grass: 161589, wooded: 391269, non_agrarian_surface: 95577},
    {year: "2020", province: "granada", ground: 534974, grass: 158569, wooded: 490865, non_agrarian_surface: 80282},
    {year: "2019", province: "cadiz", ground: 287411, grass: 113120, wooded: 240573, non_agrarian_surface: 102517},
    {year: "2018", province: "jaén", ground: 651284, grass: 141269, wooded: 482836, non_agrarian_surface: 74220},
    {year: "2020", province: "sevilla", ground: 806241, grass: 137214, wooded: 313296, non_agrarian_surface: 146857},
    {year: "2021", province: "cadiz", ground: 285947, grass: 119568, wooded: 235314, non_agrarian_surface: 103006},
    {year: "2021", province: "caceres", ground: 397184, grass: 335124, wooded: 306463, non_agrarian_surface: 483914},
    {year: "2018", province: "cadiz", ground: 292937, grass: 109096, wooded: 239226, non_agrarian_surface: 102365}
];

function mediaTotalGround(datos) {
    let sumaGround = 0;
    let cantidad = 0;

    datos.forEach(element => {
        sumaGround += element.ground;
        cantidad += 1;
    });

    return sumaGround / cantidad;
}

console.log(mediaTotalGround(surfaceData));