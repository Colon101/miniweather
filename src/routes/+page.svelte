<script lang="ts">
	import WeatherIcon from '$lib/WeatherIcon.svelte';
	import type { PageData } from './$types';
	let showIp = false;
	export let data: PageData;

	const forecast = data.forecast;
</script>

<svelte:head
	><meta name="description" content="Realtime weather" /><title>MiniWeather</title></svelte:head
>

<div class="flex flex-col min-h-screen">
	<div class="flex-grow">
		<h1 class="max-w-[100%] text-center text-4xl">{data.city} {data.temp}℃</h1>

		{#if showIp}
			<p>ip address:{data.ip}</p>
			<p>longitude:{data.long}, latitude:{data.lat}<br />city:{data.city}</p>
		{/if}
		<p class="text-center text-xl">feels like {data.feelsLike}C</p>
		<p class="text-center text-xl">Real weather is {data.temp}℃</p>
		<p class="text-center text-xl">Condition: {data.weatherType}</p>
		<h2 class="text-3xl text-center">Forecast</h2>
		<div class="overflow-x-scroll flex">
			{#if forecast}
				{#each forecast as day}
					<div
						class="pl-2 flex flex-col items-center rounded-lg shadow-xl bg-neutral-200 p-4 m-2 sm:w-32 md:w-48 lg:w-64 xl:w-72"
					>
						<p class="text-3xl">{day.temp}℃</p>
						<p class="text-center">{day.dayName}</p>
						<div class="w-16 h-16 flex justify-center items-center">
							<WeatherIcon icon={day.icon} />
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<footer class="bg-gray-800 text-white py-4">
		<div class="container mx-auto flex justify-center items-center">
			<p class="text-sm">This website does not track your data</p>
			<a
				href="https://github.com/Colon101/miniweather"
				class="text-blue-300 ml-2 hover:text-blue-100 text-sm"
			>
				Source Code
			</a>
		</div>
	</footer>
</div>
