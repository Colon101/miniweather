<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import WeatherIcon from '$lib/WeatherIcon.svelte';
	import type { PageData } from './$types';
	let showIp = false;
	export let data: PageData;
	let showcar = false;
	onMount(() => {
		showcar = true;
	});
	const forecast = data.forecast;
</script>

<svelte:head
	><meta name="description" content="Realtime weather" /><title>MiniWeather</title></svelte:head
>

<div class="flex flex-col min-h-screen">
	<div class="flex-grow">
		<div class="flex items-center space-x-2">
			<Switch id="ip" bind:checked={showIp}>hello</Switch>
			<Label for="ip">Show IP (not recommended)</Label>
		</div>

		<h1 class="max-w-[100%] text-center text-4xl">{data.city} {data.temp}℃</h1>

		{#if showIp}
			<div out:fade in:fly={{ y: 200, duration: 2000 }}>
				<p class="text-center text-xl">ip address:{data.ip}</p>
				<p class="text-center text-xl">
					longitude:{data.long}, latitude:{data.lat}<br />city:{data.city}
				</p>
			</div>
		{/if}
		<div>
			<p class="text-center text-xl">feels like {data.feelsLike}C</p>
			<p class="text-center text-xl">Real weather is {data.temp}℃</p>
			<p class="text-center text-xl">Condition: {data.weatherType}</p>
			<h2 class="text-3xl text-center">Forecast</h2>
			{#if showcar}
				<div class="overflow-x-scroll flex" transition:fly={{ y: 200, duration: 2000 }}>
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
