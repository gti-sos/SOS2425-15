<svelte:head>
    <title>
        Temperatures Manager
    </title>
</svelte:head>

<script>
    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table,Button } from "@sveltestrap/sveltestrap";
    
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/temperature-stats/";




    let mensajeUsuario = "";
    let tipoMensaje = "";
    function mostrarMensaje(texto, tipo = "ok") {
        mensajeUsuario = texto;
        tipoMensaje = tipo;
        setTimeout(() => mensajeUsuario = "", 3000);
    }




    if(dev){
        API = DEVEL_HOST + API
    }
    let TemperaturesData = [];
    let result ="";
    let resultStatus ="";
    let newTemperatureIneCode;
    let newTemperatureProvince;
    let newTemperatureAverage_temperature;
    let newTemperatureYear;
    let newTemperatureMinimum_average;
    let newTemperatureMaximum_average;

    //ine_code, year, province, average_temperature, minimum_average, maximum_average

    let status_mens = "";

    let provinces = [];

    let searchIneCode = "";
    let searchProvince = "";
    let searchAverage_temperature = "";
    let searchMinimum_average = "";
    let searchMaximum_average = "";
    let searchYear = "";
    let searchFrom = "";
    let searchTo = "";
    let searchLimit = "";
    let searchOffset = "";

    async function getTemperatures() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            TemperaturesData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }
    async function deleteTemperature(ine_code) {
        resultStatus = result = "";
        try {
            const res = await fetch(API+ine_code, {method:"DELETE"});  
            const status = res.status;            
            resultStatus=status;
            if (status==200){
                console.log(`Dato ine_code:${ine_code} borrado con éxito`)
                status_mens = "Dato borrado"
                mostrarMensaje(`✅ Temperatura ${ine_code} eliminada correctamente`, "ok")
                getTemperatures();
            }else{
                if(status ==404){
                    alert(`No se ha encontrado el dato ine_code:${ine_code} `)
                    mostrarMensaje("❌ Error al eliminar la temperatura", "error")
                }
                console.log(`ERROR deleting Temperature ${ine_code}: status received\n${status}`);
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
            mostrarMensaje("❌ Error al eliminar la temperatura", "error")
        }
    }

    async function deleteAllTemperatures() {
        try {
            const res = await fetch(API, {method:"DELETE"});  
            const status = res.status;            
            resultStatus=status;
            if (status==200){
                console.log("Todos los datos se han borrado")
                mostrarMensaje("✅ Todos las temperaturas han sido eliminadas", "ok");
                getTemperatures();
            }else {                
            console.log(`ERROR deleting all Temperatures: status received\n${status}`);
            mostrarMensaje("❌ Los datos ya estan borrados", "ok");
        }
        } catch (error) {
            console.log(`ERROR deleting all data from ${API}: ${error}`);
            mostrarMensaje("❌ Los datos ya estan borrados", "ok");
        }
    }

    function toValidNumber(value) {
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }

    async function createTemperature() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "ine_code": toValidNumber(Number(newTemperatureIneCode)),
                    "province": newTemperatureProvince?.trim()|| undefined,
                    "average_temperature": toValidNumber(Number(newTemperatureAverage_temperature)),
                    "year": toValidNumber(Number(newTemperatureYear)),
                    "minimum_average": toValidNumber(Number(newTemperatureMinimum_average)),
                    "maximum_average": toValidNumber(Number(newTemperatureMaximum_average))
            })
            });        
            
            const status = res.status;
            resultStatus=status
            console.log(newTemperatureMinimum_average)
            if (status==201){
                console.log(`Temperature created: \n${JSON.stringify(TemperaturesData,null,2)}`);
                mostrarMensaje("✅ Ocupación creado correctamente", "ok");
                getTemperatures();
                newTemperatureIneCode = "";
                newTemperatureProvince = "";
                newTemperatureAverage_temperature = "";
                newTemperatureYear = "";
                newTemperatureMinimum_average = "";
                newTemperatureMaximum_average = "";
                searchIneCode = "";
                searchProvince = "";
                searchAverage_temperature = "";
                searchMinimum_average = "";
                searchMaximum_average = "";
                searchYear = "";
                searchFrom = "";
                searchTo = "";
                searchLimit = "";
                searchOffset = "";
            }else{
                if(status ==400){
                    alert(`Faltan datos por rellenar`)
                    mostrarMensaje("⚠️ Datos inválidos o faltantes. Revisa los campos.", "error");
                }else if(status ==409){
                    alert(`Ya existen esos datos`)   
                    mostrarMensaje("⚠️ Ya existe una ocupacion con ese ID", "error");                 
                }
                console.log(`ERROR creating Temperature:\n${status}`)
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
            mostrarMensaje("❌ Error al crear el accidente", "error");
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
                mostrarMensaje("✅ Datos iniciales cargados correctamente", "ok");
                getTemperatures();
            } else {
                const errorText = await res.text();
                console.error("Error:", errorText);
                mostrarMensaje("❌ Error al cargar los datos iniciales", "error");
                alert(`No se pudieron cargar los datos: ${errorText}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            mostrarMensaje("❌ Error al cargar los datos iniciales", "error");
            alert(`Error de red al cargar los datos: ${error}`);
        }
    }

    async function searchTemperatures() {
        let url = `${API}?`;
        const params = [];
            console.log(searchAverage_temperature);
        if (searchIneCode) params.push(`ine_code=${searchIneCode}`);
        if (searchProvince && !searchAverage_temperature)params.push(`province=${encodeURIComponent(searchProvince)}`);
        if (searchAverage_temperature && !searchProvince)params.push(`average_temperature=${encodeURIComponent(searchAverage_temperature)}`);
        if (searchYear) params.push(`year=${searchYear}`);
        if (searchFrom) params.push(`from=${searchFrom}`);
        if (searchTo) params.push(`to=${searchTo}`);
        if (searchLimit) params.push(`limit=${searchLimit}`);
        if (searchOffset) params.push(`offset=${searchOffset}`);

        url += params.join("&");

        try {
            const res = await fetch(url);
            const data = await res.json();
            TemperaturesData = data // actualizar el array con los resultados
        } catch (error) {
            console.error("Error al buscar ocupaciones:", error);
        }
    }

    onMount(async () => {
        getTemperatures();
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
            //autonomousCommunities = Array.from(new Set(data.map(d => d.average_temperature).filter(Boolean))).sort();
            // Guardar en localStorage
            localStorage.setItem('provinces', JSON.stringify(provinces));
            //localStorage.setItem('autonomousCommunities', JSON.stringify(autonomousCommunities));
        } catch (error) {
            console.error("Error al cargar provincias:", error);
        }
    }
    })

</script>

<h3>Buscar average_temperature</h3>
<div>
    <input placeholder="INE code" bind:value={searchIneCode} />
    <select bind:value={searchProvince} disabled={searchAverage_temperature}>
        <option value="">-- Provincia --</option>
        {#each provinces as province}
            <option value={province}>{province}</option>
        {/each}
    </select>
    <!-- 
    <select bind:value={searchAverage_temperature} disabled={searchProvince}>
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

    <Button on:click={searchTemperatures}>Buscar</Button>
</div>



<h2>temperature-stats</h2>


{#if mensajeUsuario}
    <div class={`alert ${tipoMensaje === "error" ? "alert-danger" : "alert-success"}`}>
        {mensajeUsuario}
    </div>
{/if}
<!-- 
{#if resultStatus}
    <div>
        <strong>Estado:</strong> {resultStatus}
    </div>
{/if}

{#if result}
    <div>
        <strong>Respuesta:</strong>
        <pre>{result}</pre>
    </div>
{/if}
-->


<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>province</th>
            <th>average_temperature</th>
            <th>year</th>
            <th>minimum_average</th>
            <th>maximum_average</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> 
                <input bind:value={newTemperatureIneCode}>
            </td>
            <td> 
                <input bind:value={newTemperatureProvince}>
            </td>
            <td> 
                <input bind:value={newTemperatureAverage_temperature}>
            </td>
            <td> 
                <input bind:value={newTemperatureYear}>
            </td>
            <td> 
                <input bind:value={newTemperatureMinimum_average}>
            </td>
            <td> 
                <input bind:value={newTemperatureMaximum_average}>
            </td>
            
            <td>
                <Button color="primary" on:click={createTemperature} >Crear registro</Button>
            </td>
        </tr>

        {#each TemperaturesData.slice().sort((a, b) => a.ine_code - b.ine_code) as Temperature}
        <tr>
            <td>
                {Temperature.ine_code}
            </td>
            <td>
                {Temperature.province}
            </td>
            <td>
                {Temperature.average_temperature}
            </td>
            <td>
                {Temperature.year}
            </td>
            <td>
                {Temperature.minimum_average}
            </td>
            <td>
                {Temperature.maximum_average}
            </td>
            <td>
                <Button color="danger" on:click={()=>{deleteTemperature(Temperature.ine_code,Temperature.year)}} >Borrar</Button>
                <a href={`/temperature-stats/editar/${Temperature.ine_code}/${Temperature.year}`}> <Button color="secondary">Editar</Button></a>                  
            </td>
        </tr>
        {/each}
    </tbody>
</Table>

<Button color="danger" on:click={()=>{deleteAllTemperatures()}} >Borrar datos</Button>
<Button color="primary" on:click={()=>{loadInitialData()}} >Datos de prueba</Button>