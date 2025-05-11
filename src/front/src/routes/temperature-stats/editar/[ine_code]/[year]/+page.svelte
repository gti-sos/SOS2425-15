<svelte:head>
    <title>Edit temperature Info</title>
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
    let API = "/api/v1/temperature-stats/";


    let mensajeUsuario = "";
    let tipoMensaje = "";
    function mostrarMensaje(texto, tipo = "ok") {
        mensajeUsuario = texto;
        tipoMensaje = tipo;
        setTimeout(() => mensajeUsuario = "", 3000);
    }



    
    if (dev) {
        API = DEVEL_HOST + API;
    }
    let temperatureData = [];
    let result = "";
    let resultStatus = "";

    // Variables para editar
    let editIneCode = "";
    let editProvince = "";
    let editYear = "";
    let editAverage_temperature = "";
    let editMinimum_average = "";
    let editMaximum_average = "";

    //ine_code, year, province, average_temperature, minimum_average, maximum_average

    async function getTemperature() {
        resultStatus = result = "";

        const $page = get(page);
        let ineCode = $page.params.ine_code;
        let year = $page.params.year;

        try {
            const res = await fetch(`${API}${ineCode}`, { method: "GET" });
            const data = await res.json();

            temperatureData = [data]; // aseguramos que sea array
            const s = temperatureData[0];

            // Rellenar inputs con valores del recurso
            editIneCode = s.ine_code;
            editProvince = s.province;
            editAverage_temperature = s.average_temperature;
            editYear = s.year;
            editMinimum_average = s.minimum_average;
            editMaximum_average = s.maximum_average;

        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    async function updateTemperature(temperature) {
        const url = `${API}${temperature.ine_code}`;
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(temperature)
            });

            let status = await res.status
            if (status ==200) {
                console.log("Temperature updated successfully");
                console.log("Dato actualizado correctamente")
                mostrarMensaje(`✅ Temperatura actualizado correctamente`, "ok")

                setTimeout(() => {
                    goto("/temperature-stats");
                }, 1500);
                //goto("/temperature-stats"); // recarga el dato actualizado
            } else {
                console.error("Failed to update temperature", res.status);
                mostrarMensaje("❌ Error al ctualizar la temperatura", "error")

            }
        } catch (error) {
            console.error("Error updating temperature", error);
        }
    }

    function updateTemperatureFromInputs() {
        const updatedTemperature = {
            ine_code: Number(editIneCode),
            province: editProvince,
            average_temperature: Number(editAverage_temperature),
            year: Number(editYear),
            minimum_average: Number(editMinimum_average),
            maximum_average: Number(editMaximum_average),
        };

        updateTemperature(updatedTemperature);
    }

    onMount(() => {
        getTemperature();
    });
</script>

<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>province</th>
            <th>average_temperature</th>
            <th>year</th>
            <th>minimum_average</th>
            <th>maximum_average</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={editIneCode} disabled></td>
            <td><input bind:value={editProvince}></td>
            <td><input bind:value={editAverage_temperature}></td>
            <td><input bind:value={editYear} disabled></td>
            <td><input bind:value={editMinimum_average}></td>
            <td><input bind:value={editMaximum_average}></td>
            <td>
                <Button color="warning" on:click={updateTemperatureFromInputs}>Actualizar</Button>
            </td>
        </tr>
    </tbody>
</Table>

{#if mensajeUsuario}
    <div class={`alert ${tipoMensaje === "error" ? "alert-danger" : "alert-success"}`}>
        {mensajeUsuario}
    </div>
{/if}
