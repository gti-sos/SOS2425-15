<svelte:head>
    <title>
        Precipitations Manager
    </title>
</svelte:head>

<script>
    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table, Button } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/precipitation-stats/";
    if(dev){
        API = DEVEL_HOST + API
    }
    let precipitation_stats = [];
    let result ="";
    let resultStatus ="";
    let newPrecipitationIneCode;
    let newPrecipitationYear;
    let newPrecipitationProvince;
    let newPrecipitationAnnualPrecipitation;
    let newPrecipitationHistoricalAverage;
    let newPrecipitationDeviation;


    let provinces = [];

    let searchIneCode = "";
    let searchYear = "";
    let searchProvince = "";
    let searchAnnualPrecipitation = "";
    let searchHistoricalAverage = "";
    let searchDeviation = "";
    let searchFrom = "";
    let searchTo = "";
    let searchLimit = "";
    let searchOffset = "";

    async function getPrecipitations() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            precipitation_stats = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }
    async function deletePrecipitation(ine_code) {
        resultStatus = result = "";
        try {
            const res = await fetch(API+ine_code, {method:"DELETE"});  
            const status = res.status;            
            resultStatus=status;
            if (status==200){
                console.log(`Dato ine_code:${ine_code} borrado con éxito`)
                getPrecipitations();
            }else{
                if(status ==404){
                    alert(`No se ha encontrado el dato ine_code:${ine_code} `)
                }
                console.log(`ERROR deleting Precipitation ${ine_code}: status received\n${status}`);
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    async function deleteAllPrecipitations() {
        try {
            const res = await fetch(API, {method:"DELETE"});  
            const status = res.status;            
            resultStatus=status;
            if (status==200){
                console.log("Todos los datos se han borrado")
                getPrecipitations();
            }else {                
            console.log(`ERROR deleting all Ocupieds: status received\n${status}`);
        }
        } catch (error) {
            console.log(`ERROR deleting all data from ${API}: ${error}`);
        }
    }

    function toValidNumber(value) {
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }

    async function createPrecipitation() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "ine_code": toValidNumber(Number(newPrecipitationIneCode)),
                    "year": toValidNumber(Number(newPrecipitationYear)),
                    "province": newPrecipitationProvince?.trim()|| undefined,
                    "annual_precipitation": toValidNumber(Number(newPrecipitationAnnualPrecipitation)),
                    "historical_average": toValidNumber(Number(newPrecipitationHistoricalAverage)),
                    "deviation": toValidNumber(Number(newPrecipitationDeviation)),
            })
            });        
            
            const status = res.status;
            resultStatus=status
            console.log(newPrecipitationAnnualPrecipitation)
            if (status==201){
                console.log(`Precipitation created: \n${JSON.stringify(precipitation_stats,null,2)}`);
                getPrecipitations();
                newPrecipitationIneCode = "";
                newPrecipitationYear = "";
                newPrecipitationProvince = "";
                newPrecipitationAnnualPrecipitation = "";
                newPrecipitationHistoricalAverage = "";
                newPrecipitationDeviation= "";
                searchIneCode = "";
                searchYear = "";
                searchProvince = "";
                searchAnnualPrecipitation = "";
                searchHistoricalAverage = "";
                searchDeviation = "";
                searchFrom = "";
                searchTo = "";
                searchLimit = "";
                searchOffset = "";
            }else{
                if(status ==400){
                    alert(`Faltan datos por rellenar`)
                }else if(status ==409){
                    alert(`Ya existen esos datos`)                    
                }
                console.log(`ERROR creating Ocupied:\n${status}`)
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }

    async function loadInitialData() {
        try {
            const res = await fetch(API + "loadInitialData");
            const status = res.status;
            resultStatus=status
            if (status==200) {
                const data = await res.json();
                console.log("Datos iniciales cargados");
                getPrecipitations();
            } else {
                const errorText = await res.text();
                console.error("Error:", errorText);
                alert(`No se pudieron cargar los datos: ${errorText}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert(`Error de red al cargar los datos: ${error}`);
        }
    }

    async function searchPrecipitations() {
        let url = `${API}?`;
        const params = [];
            console.log(searchAnnualPrecipitation);
        if (searchIneCode) params.push(`ine_code=${searchIneCode}`);
        if (searchProvince && !searchAnnualPrecipitation)params.push(`province=${encodeURIComponent(searchProvince)}`);
        if (searchAnnualPrecipitation && !searchProvince)params.push(`ground=${encodeURIComponent(searchAnnualPrecipitation)}`);
        if (searchYear) params.push(`year=${searchYear}`);
        if (searchFrom) params.push(`from=${searchFrom}`);
        if (searchTo) params.push(`to=${searchTo}`);
        if (searchLimit) params.push(`limit=${searchLimit}`);
        if (searchOffset) params.push(`offset=${searchOffset}`);

        url += params.join("&");

        try {
            const res = await fetch(url);
            const data = await res.json();
            precipitation_stats = data // actualizar el array con los resultados
        } catch (error) {
            console.error("Error al buscar ocupaciones:", error);
        }
    }

    onMount(async () => {
        getPrecipitations();
        // Intenta cargar desde localStorage
    const savedProvinces = localStorage.getItem('provinces');

    //const savedCommunities = localStorage.getItem('autonomousCommunities');

    /*
    if (savedProvinces && savedCommunities) {
        provinces = JSON.parse(savedProvinces);
        autonomousCommunities = JSON.parse(savedCommunities);
    } 
        */
    if (savedProvinces) {
        provinces = JSON.parse(savedProvinces);
    } else {
        try {
            const res = await fetch(`${API}`);
            const data = await res.json();

            provinces = Array.from(new Set(data.map(d => d.province).filter(Boolean))).sort();
            //autonomousCommunities = Array.from(new Set(data.map(d => d.ground).filter(Boolean))).sort();
            // Guardar en localStorage
            localStorage.setItem('provinces', JSON.stringify(provinces));
            //localStorage.setItem('autonomousCommunities', JSON.stringify(autonomousCommunities));
        } catch (error) {
            console.error("Error al cargar provincias:", error);
        }
    }
    })

</script>

<h3>Buscar </h3>
<div>
    <input placeholder="INE code" bind:value={searchIneCode} />
    <select bind:value={searchProvince} disabled={searchAnnualPrecipitation}>
        <option value="">-- Provincia --</option>
        {#each provinces as province}
            <option value={province}>{province}</option>
        {/each}
    </select>
    <!-- 
    <select bind:value={searchGround} disabled={searchProvince}>
        <option value="">-- Comunidad Autónoma --</option>
        {#each autonomousCommunities as community}
            <option value={community}>{community}</option>
        {/each}
    </select>
    -->
    <input placeholder="Año" bind:value={searchYear} />
    <input placeholder="Desde (año)" bind:value={searchFrom} />
    <input placeholder="Hasta (año)" bind:value={searchTo} />
    <input placeholder="Cantidad de resultados a mostrar" bind:value={searchLimit} />
    <input placeholder="Saltar los primeros resultados" bind:value={searchOffset} />

    <Button on:click={searchPrecipitations}>Buscar</Button>
</div>



<h2>precipitations-stats</h2>
<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>year</th>
            <th>province</th>
            <th>annual_precipitation</th>
            <th>historical_average</th>
            <th>deviation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> 
                <input bind:value={newPrecipitationIneCode}>
            </td>
            <td> 
                <input bind:value={newPrecipitationYear}>
            </td>
            <td> 
                <input bind:value={newPrecipitationProvince}>
            </td>
            <td> 
                <input bind:value={newPrecipitationAnnualPrecipitation}>
            </td>
            
            <td> 
                <input bind:value={newPrecipitationHistoricalAverage}>
            </td>
            <td> 
                <input bind:value={newPrecipitationDeviation}>
            </td>
            
            <td>
                <Button color="primary" on:click={createPrecipitation} >Crear registro</Button>
            </td>
        </tr>

        {#each precipitation_stats.slice().sort((a, b) => a.ine_code - b.ine_code) as Precipitation}
        <tr>
            <td>
                {Precipitation.ine_code}
            </td>
            <td>
                {Precipitation.year}
            </td>
            <td>
                {Precipitation.province}
            </td>
            <td>
                {Precipitation.annual_precipitation}
            </td>
            <td>
                {Precipitation.historical_average}
            </td>
            <td>
                {Precipitation.deviation}
            </td>
            <td>
                <Button color="danger" on:click={()=>{deletePrecipitation(Precipitation.ine_code,Precipitation.year)}} >Borrar</Button>
                <a href={`/precipitation-stats/editar/${Precipitation.ine_code}/${Precipitation.year}`}> <Button color="secondary">Editar</Button></a>                  
            </td>
        </tr>
        {/each}
    </tbody>
</Table>

<Button color="danger" on:click={()=>{deleteAllPrecipitations()}} >Borrar datos</Button>
<Button color="primary" on:click={()=>{loadInitialData()}} >Datos de prueba</Button>