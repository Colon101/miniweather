<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head
	><meta name="description" content="Realtime weather" /><title>Weather</title></svelte:head
>

<h1>Welcome to my weather info</h1>

<p>ip address:{data.ip} <br />longitude:{data.long}, latitude:{data.lat}<br />city:{data.city}</p>
<p>weather in {data.city} feels like {data.feelsLike}C</p>
<p>Real weather is {data.temp}C</p>
<p>Condition: {data.weathertype}</p>
<footer>
	This website does not track your data and you can check out the source code <a
		href="https://github.com">here</a
	>
</footer>
