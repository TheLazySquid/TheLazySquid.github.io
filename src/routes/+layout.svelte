<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from "svelte-french-toast";
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="bottom-right" toastOptions={{ className: "toast" }} />

{@render children?.()}

<style>
	:global(.toast) {
		background-color: var(--color-backdrop) !important;
		color: var(--color-yellow-200) !important;
	}
</style>