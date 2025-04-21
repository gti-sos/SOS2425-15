<svelte:head>
    <title> Edit Ocupied Info</title>
</svelte:head>
<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { Table,Button } from 'sveltestrap';
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    import { goto } from '$app/navigation';
	import { title } from "process";


    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/ocupied-grand-stats/";
    if (dev) {
        API = DEVEL_HOST + API;
    }

    let ocupiedData = [];
    let result = "";
    let resultStatus = "";

    // Variables para editar
    let editIneCode = "";
    let editProvince = "";
    let editGround = "";
    let editYear = "";
    let editGrass = "";
    let editWooded = "";
    let editNon_agrarian_surface = "";

    async function getOcupied() {
        resultStatus = result = "";

        const $page = get(page);
        let ineCode = $page.params.ine_code;
        let year = $page.params.year;

        try {
            const res = await fetch(`${API}${ineCode}/${year}`, { method: "GET" });
            const data = await res.json();

            ocupiedData = [data]; // aseguramos que sea array
            const s = ocupiedData[0];

            // Rellenar inputs con valores del recurso
            editIneCode = s.ine_code;
            editProvince = s.province;
            editGround = s.ground;
            editYear = s.year;
            editGrass = s.grass;
            editWooded = s.wooded;
            editNon_agrarian_surface = s.non_agrarian_surface;

        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    async function updateOcupied(ocupied) {
        const url = `${API}${ocupied.ine_code}/${ocupied.year}`;
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ocupied)
            });

            let status = await res.status
            if (status ==200) {
                console.log("Ocupied updated successfully");
                console.log("Dato actualizado correctamente")
                goto("/ocupied-grand-stats"); // recarga el dato actualizado
            } else {
                console.error("Failed to update ocupied", res.status);
            }
        } catch (error) {
            console.error("Error updating ocupied", error);
        }
    }

    function updateOcupiedFromInputs() {
        const updatedOcupied = {
            ine_code: Number(editIneCode),
            province: editProvince,
            ground: Number(editGround),
            year: Number(editYear),
            grass: Number(editGrass),
            wooded: Number(editWooded),
            non_agrarian_surface: Number(editNon_agrarian_surface)
        };

        updateOcupied(updatedOcupied);
    }

    onMount(() => {
        getOcupied();
    });
</script>

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
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={editIneCode} disabled></td>
            <td><input bind:value={editProvince}></td>
            <td><input bind:value={editGround}></td>
            <td><input bind:value={editYear} disabled></td>
            <td><input bind:value={editGrass}></td>
            <td><input bind:value={editWooded}></td>
            <td><input bind:value={editNon_agrarian_surface}></td>
            <td>
                <Button color="warning" on:click={updateOcupiedFromInputs}>Actualizar</Button>
            </td>
        </tr>
    </tbody>
</Table>