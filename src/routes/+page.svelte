<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import WeatherIcon from '$lib/WeatherIcon.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let showIp = false;
	let showcar = false;
	let message = '';
	let dataElement: HTMLElement | null;
	let dark: boolean;
	$: dataHeight = dataElement != null ? dataElement.offsetHeight : 0;
	$: dataOffset = window.innerHeight - dataHeight;
	onMount(() => {
		dark = false;
		dataElement = document.getElementById('data');
		window.addEventListener('resize', () => {
			dataHeight = dataElement != null ? dataElement.offsetHeight : 0;
			dataOffset = window.innerHeight - dataHeight;
		});

		navigator.serviceWorker.addEventListener('message', (event) => {
			if (event.data.type === 'IS_OFFLINE') {
				message = event.data.message;
			}
		});
		showcar = true;
	});
	const forecast = data.forecast;

	$: dark
		? window.document.body.classList.add('darkmode')
		: window.document.body.classList.remove('darkmode');
</script>

<svelte:head
	><meta name="description" content="Realtime weather" /><title>MiniWeather</title></svelte:head
>

<div class="fixed top-0 left-0 z-50 flex items-center space-x-2 m-4">
	<Switch id="dark" bind:checked={dark} aria-label="darkSwitch"></Switch>
	<Label for="dark">Dark Mode</Label>
</div>
<div class="h-0 max-md:h-8"></div>
<!-- <div class="fixed top-0 left-0 z-50 flex items-center space-x-2 m-4 mt-12">
	<Switch id="ip" bind:checked={showIp} aria-label="ipSwitch"></Switch>
	<Label for="ip">Show IP (not recommended)</Label>
</div> -->
{#if !dark}
	<div id="data">
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
					{#each forecast as day}
						<div
							class="pl-2 flex flex-col items-center rounded-lg shadow-xl bg-neutral-200 p-4 m-2 sm:w-32 md:w-48 lg:w-64 xl:w-72 min-w-28"
						>
							<p class="text-3xl">{day.temp}℃</p>
							<p class="text-center">{day.dayName}</p>
							<div class="w-16 h-16 flex justify-center items-center">
								<WeatherIcon icon={day.icon} />
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	{#if message != ''}
		<div class="flex justify-center items-center" style="height:{Math.floor(dataOffset / 2)}px;">
			<!-- Centered with the container's height -->
			<div class="flex flex-col items-center">
				<p class="text-2xl">
					{message}
				</p>
				<button
					class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
					on:click={() => {
						window.location.reload();
					}}>Click here to refresh</button
				>
			</div>
		</div>
	{/if}

	<footer class="bg-gray-800 text-white py-4 bottom-0 fixed w-full">
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
{:else}
	<div id="data">
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
					{#each forecast as day}
						<div
							class="pl-2 flex flex-col items-center rounded-lg border-2 bg-neutral-500 p-4 m-2 sm:w-32 md:w-48 lg:w-64 xl:w-72 min-w-28"
						>
							<p class="text-3xl">{day.temp}℃</p>
							<p class="text-center">{day.dayName}</p>
							<div class="w-16 h-16 flex justify-center items-center">
								<WeatherIcon icon={day.icon} />
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	{#if message != ''}
		<div class="flex justify-center items-center" style="height:{Math.floor(dataOffset / 2)}px;">
			<!-- Centered with the container's height -->
			<div class="flex flex-col items-center">
				<p class="text-2xl">
					{message}
				</p>
				<button
					class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
					on:click={() => {
						window.location.reload();
					}}>Click here to refresh</button
				>
			</div>
		</div>
	{/if}

	<footer class="bg-gray-800 text-white py-4 bottom-0 fixed w-full">
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
{/if}

<style>
	:global(body) {
		transition: background 0.1s;
	}
	:global(body.darkmode) {
		background-color: #222222;
		color: white;
	}
</style>
