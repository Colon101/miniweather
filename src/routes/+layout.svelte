<script lang="ts">
	import { onMount } from 'svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import '../app.css';
	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;
		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					if (confirm('New update available! Reload to update?')) {
						newSW.postMessage({ type: 'SKIP_WAIT' });
						window.location.reload();
					}
				}
			});
		});
	}
	onMount(() => {
		detectSWUpdate();
	});
	// injectSpeedInsights(); I nono wanna hurt adblockers
</script>

<slot />
