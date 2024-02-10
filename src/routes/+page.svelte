<script lang="ts">
	import WeatherIcon from '$lib/WeatherIcon.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const forecast = data.forecast;
</script>

<svelte:head
	><meta name="description" content="Realtime weather" /><title>MiniWeather</title></svelte:head
>

<h1>Welcome to my lightweight weather info</h1>

<p>ip address:{data.ip} <br />longitude:{data.long}, latitude:{data.lat}<br />city:{data.city}</p>
<p>weather in {data.city} feels like {data.feelsLike}C</p>
<p>Real weather is {data.temp}C</p>
<p>Condition: {data.weatherType}</p>
<h2>Forecast</h2>
{#if forecast}
	{#each forecast as day}
		<div style="display:flex">
			<div style="width:30px;padding-top:12px;padding-right:10px">
				<WeatherIcon icon={day.icon} />
			</div>
			<p>{day.dayName}:{day.temp}C</p>
		</div>
	{/each}
{/if}
<footer>
	This website does not track your data <a href="https://github.com/Colon101/miniweather"
		>Source Code</a
	>
</footer>
