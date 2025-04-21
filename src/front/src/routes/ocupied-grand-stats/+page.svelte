<script>
    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table,Button } from 'sveltestrap';

    
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/ocupied-grand-stats/";
    if(dev){
        API = DEVEL_HOST + API
    }
    let OcupiedsData = [];
    let result ="";
    let resultStatus ="";
    let newOcupiedIneCode;
    let newOcupiedProvince;
    let newOcupiedGround;
    let newOcupiedYear;
    let newOcupiedGrass;
    let newOcupiedWooded;
    let newOcupiedNon_agrarian_surface;


    let provinces = [];

    let searchIneCode = "";
    let searchProvince = "";
    let searchGround = "";
    let searchGrass = "";
    let searchWooded = "";
    let searchNon_agrarian_surface = "";
    let searchYear = "";
    let searchFrom = "";
    let searchTo = "";
    let searchLimit = "";
    let searchOffset = "";

    async function getOcupieds() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            OcupiedsData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }
    async function deleteOcupied(ine_code,year) {
        resultStatus = result = "";
        try {
            const res = await fetch(API+ine_code+"/"+year, {method:"DELETE"});  
            const status = res.status;            
            resultStatus=status;
            if (status==200){
                console.log(`Dato ine_code:${ine_code}, año:${year} borrado con éxito`)
                getOcupieds();
            }else{
                if(status ==404){
                    alert(`No se ha encontrado el dato ine_code:${ine_code}, año:${year} `)
                }
                console.log(`ERROR deleting Ocupied ${ine_code} ${year}: status received\n${status}`);
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    async function deleteAllOcupieds() {
        try {
            const res = await fetch(API, {method:"DELETE"});  
            const status = res.status;            
            resultStatus=status;
            if (status==200){
                console.log("Todos los datos se han borrado")
                getOcupieds();
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

    async function createOcupied() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "ine_code": toValidNumber(Number(newOcupiedIneCode)),
                    "province": newOcupiedProvince?.trim()|| undefined,
                    "ground": toValidNumber(Number(newOcupiedGround)),
                    "year": toValidNumber(Number(newOcupiedYear)),
                    "grass": toValidNumber(Number(newOcupiedGrass)),
                    "wooded": toValidNumber(Number(newOcupiedWooded)),
                    "non_agrarian_surface": toValidNumber(Number(newOcupiedNon_agrarian_surface))
            })
            });        
            
            const status = res.status;
            resultStatus=status
            console.log(newOcupiedGrass)
            if (status==201){
                console.log(`Ocupied created: \n${JSON.stringify(OcupiedsData,null,2)}`);
                getOcupieds();
                newOcupiedIneCode = "";
                newOcupiedProvince = "";
                newOcupiedGround = "";
                newOcupiedYear = "";
                newOcupiedGrass = "";
                newOcupiedWooded = "";
                newOcupiedNon_agrarian_surface = "";
                searchIneCode = "";
                searchProvince = "";
                searchGround = "";
                searchGrass = "";
                searchWooded = "";
                searchNon_agrarian_surface = "";
                searchYear = "";
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
                getOcupieds();
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

    async function searchOcupieds() {
        let url = `${API}?`;
        const params = [];
            console.log(searchGround);
        if (searchIneCode) params.push(`ine_code=${searchIneCode}`);
        if (searchProvince && !searchGround)params.push(`province=${encodeURIComponent(searchProvince)}`);
        if (searchGround && !searchProvince)params.push(`ground=${encodeURIComponent(searchGround)}`);
        if (searchYear) params.push(`year=${searchYear}`);
        if (searchFrom) params.push(`from=${searchFrom}`);
        if (searchTo) params.push(`to=${searchTo}`);
        if (searchLimit) params.push(`limit=${searchLimit}`);
        if (searchOffset) params.push(`offset=${searchOffset}`);

        url += params.join("&");

        try {
            const res = await fetch(url);
            const data = await res.json();
            OcupiedsData = data // actualizar el array con los resultados
        } catch (error) {
            console.error("Error al buscar ocupaciones:", error);
        }
    }

    onMount(async () => {
        getOcupieds();
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

<h3>Buscar ground</h3>
<div>
    <input placeholder="INE code" bind:value={searchIneCode} />
    <select bind:value={searchProvince} disabled={searchGround}>
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

    <Button on:click={searchOcupieds}>Buscar</Button>
</div>

<svelte:head>
    <title>
        Ocupieds Manager
    </title>
</svelte:head>

<h2>ocupied-grand-stats</h2>
<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>province</th>
            <th>ground</th>
            <th>year</th>
            <th>grass</th>
            <th>wooded</th>
            <th>non_agrarian_surface</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> 
                <input bind:value={newOcupiedIneCode}>
            </td>
            <td> 
                <input bind:value={newOcupiedProvince}>
            </td>
            <td> 
                <input bind:value={newOcupiedGround}>
            </td>
            <td> 
                <input bind:value={newOcupiedYear}>
            </td>
            <td> 
                <input bind:value={newOcupiedGrass}>
            </td>
            <td> 
                <input bind:value={newOcupiedWooded}>
            </td>
            <td> 
                <input bind:value={newOcupiedNon_agrarian_surface}>
            </td>
            
            <td>
                <Button color="primary" on:click={createOcupied} >Crear registro</Button>
            </td>
        </tr>

        {#each OcupiedsData.slice().sort((a, b) => a.ine_code - b.ine_code) as Ocupied}
        <tr>
            <td>
                {Ocupied.ine_code}
            </td>
            <td>
                {Ocupied.province}
            </td>
            <td>
                {Ocupied.ground}
            </td>
            <td>
                {Ocupied.year}
            </td>
            <td>
                {Ocupied.grass}
            </td>
            <td>
                {Ocupied.wooded}
            </td>
            <td>
                {Ocupied.non_agrarian_surface}
            </td>
            <td>
                <Button color="danger" on:click={()=>{deleteOcupied(Ocupied.ine_code,Ocupied.year)}} >Borrar</Button>
                <a href={`/ocupied-grand-stats/editar/${Ocupied.ine_code}/${Ocupied.year}`}> <Button color="secondary">Editar</Button></a>                  
            </td>
        </tr>
        {/each}
    </tbody>
</Table>

<Button color="danger" on:click={()=>{deleteAllOcupieds()}} >Borrar datos</Button>
<Button color="primary" on:click={()=>{loadInitialData()}} >Datos de prueba</Button>