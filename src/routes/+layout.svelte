<script lang="ts">
	import "../app.css";
	import { Toaster } from "svelte-french-toast";
	
	let { children } = $props();
</script>

<Toaster position="bottom-right" toastOptions={{ className: "toast" }} />

{@render children?.()}

<style>
	:global(.toast) {
		background-color: var(--color-backdrop) !important;
		color: var(--color-yellow-200) !important;
	}
</style>