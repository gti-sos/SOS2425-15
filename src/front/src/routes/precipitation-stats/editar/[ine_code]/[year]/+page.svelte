<svelte:head>
    <title>Edit Precipitation Info</title>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { Table, Button } from "@sveltestrap/sveltestrap";
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    import { goto } from '$app/navigation';

    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/precipitation-stats/";
    if (dev) {
        API = DEVEL_HOST + API;
    }

    let precipitation_stats = [];
    let result = "";
    let resultStatus = "";

    // Variables para editar
    let editIneCode = "";
    let editYear = "";
    let editProvince = "";
    let editAnnualPrecipitation = "";
    let editHistoricalAverage = "";
    let editDeviation = "";
    let errorMessage = ""; // Mensaje de error
    let successMessage = ""; // Mensaje de éxito

    async function getPrecipitation() {
        resultStatus = result = "";
        errorMessage = ""; // Limpiar mensaje de error

        const $page = get(page);
        let ineCode = $page.params.ine_code;
        let year = $page.params.year;

        try {
            const res = await fetch(`${API}${ineCode}`, { method: "GET" });
            if (res.ok) {
                const data = await res.json();
                precipitation_stats = [data]; // aseguramos que sea array
                const s = precipitation_stats[0];

                // Rellenar inputs con valores del recurso
                editIneCode = s.ine_code;
                editYear = s.year;
                editProvince = s.province;
                editAnnualPrecipitation = s.annual_precipitation;
                editHistoricalAverage = s.historical_average;
                editDeviation = s.deviation;
            } else {
                errorMessage = "No se pudo obtener los datos de precipitación.";
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
            errorMessage = "Hubo un error al intentar obtener los datos.";
        }
    }

    async function updatePrecipitation(precipitation) {
    const url = `${API}${precipitation.ine_code}`;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(precipitation)
        });

        if (res.ok) {
            successMessage = "Precipitación actualizada correctamente.";
            goto("/precipitation-stats"); // Recarga el dato actualizado
        } else {
            const errorData = await res.json();
            errorMessage = `Error: ${res.status} - ${errorData.message || 'Hubo un error al actualizar la precipitación.'}`;
        }
    } catch (error) {
        console.error("Error updating precipitation", error);
        errorMessage = "Hubo un error al intentar actualizar los datos.";
    }
}


    function updatePrecipitationFromInputs() {
        const updatedPrecipitation = {
            ine_code: Number(editIneCode),
            year: Number(editYear),
            province: editProvince,
            annual_precipitation: Number(editAnnualPrecipitation),
            historical_average: Number(editHistoricalAverage),
            deviation: Number(editDeviation)
        };

        // Validación básica antes de actualizar
        if (!updatedPrecipitation.province) {
            errorMessage = "Todos los campos son obligatorios.";
            return;
        }

        updatePrecipitation(updatedPrecipitation);
    }

    onMount(() => {
        getPrecipitation();
    });
</script>

<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>year</th>
            <th>province</th>
            <th>annual_precipitation</th>
            <th>historical_average</th>
            <th>deviation</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={editIneCode} disabled></td>
            <td><input bind:value={editYear} disabled></td>
            <td><input bind:value={editProvince}></td>
            <td><input bind:value={editAnnualPrecipitation}></td>
            <td><input bind:value={editHistoricalAverage}></td>
            <td><input bind:value={editDeviation}></td>
            <td>
                <Button color="warning" on:click={updatePrecipitationFromInputs}>Actualizar</Button>
            </td>
        </tr>
    </tbody>
</Table>

{#if errorMessage}
    <div class="alert alert-danger">
        {errorMessage}
    </div>
{/if}

{#if successMessage}
    <div class="alert alert-success">
        {successMessage}
    </div>
{/if}


<!-- <svelte:head>
    <title> Edit Precipitation Info</title>
</svelte:head>
<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { Table, Button } from "sveltestrap";
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    import { goto } from '$app/navigation';
	import { title } from "process";


    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/precipitation-stats/";
    if (dev) {
        API = DEVEL_HOST + API;
    }

    let precipitation_stats = [];
    let result = "";
    let resultStatus = "";

    // Variables para editar
    let editIneCode = "";
    let editYear = "";
    let editProvince = "";
    let editAnnualPrecipitation = "";
    let editHistoricalAverage = "";
    let editDeviation = "";

    async function getPrecipitation() {
        resultStatus = result = "";

        const $page = get(page);
        let ineCode = $page.params.ine_code;
        let year = $page.params.year;

        try {
            const res = await fetch(`${API}${ineCode}/${year}`, { method: "GET" });
            const data = await res.json();

            precipitation_stats = [data]; // aseguramos que sea array
            const s = precipitation_stats[0];

            // Rellenar inputs con valores del recurso
            editIneCode = s.ine_code;
            editYear = s.year;
            editProvince = s.province;
            editAnnualPrecipitation = s.annual_precipitation;
            editHistoricalAverage = s.historical_average;
            editDeviation = s.deviation;

        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    async function updatePrecipitation(precipitation) {
        const url = `${API}${precipitation.ine_code}/${precipitation.year}`;
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(precipitation)
            });

            status = await res.status
            if (status ==200) {
                console.log("Precipitation updated successfully");
                console.log("Dato actualizado correctamente")
                goto("/precipitation-stats"); // recarga el dato actualizado
            } else {
                console.error("Failed to update precipitation", res.status);
            }
        } catch (error) {
            console.error("Error updating precipitation", error);
        }
    }

    function updatePrecipitationFromInputs() {
        const updatedPrecipitation = {
            ine_code: Number(editIneCode),
            year: Number(editYear),
            province: editProvince,
            annual_precipitation: Number(editAnnualPrecipitation),
            historical_average: Number(editHistoricalAverage),
            deviation: Number(editDeviation)
        };

        updatePrecipitation(updatedPrecipitation);
    }

    onMount(() => {
        getPrecipitation();
    });
</script>

<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>year</th>
            <th>province</th>
            <th>annual_precipitation</th>
            <th>historical_average</th>
            <th>deviation</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={editIneCode} disabled></td>
            <td><input bind:value={editYear} disabled></td>
            <td><input bind:value={editProvince}></td>
            <td><input bind:value={editAnnualPrecipitation}></td>
            <td><input bind:value={editHistoricalAverage}></td>
            <td><input bind:value={editDeviation}></td>
            <td>
                <Button color="warning" on:click={updatePrecipitationFromInputs}>Actualizar</Button>
            </td>
        </tr>
    </tbody>
</Table>-->