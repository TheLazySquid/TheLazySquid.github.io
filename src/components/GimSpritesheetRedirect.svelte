<script lang="ts">
	import { onMount } from "svelte";
	import { makeCorsUrl } from "$lib/util/net";

	let error: string | null = null;
	let params = new URLSearchParams(location.search);

	let id = params.get("id");
	onMount(async () => {
		if(!id) {
			error = "No ID provided!";
			return;
		}

		try {
			let res = await fetch(makeCorsUrl(`https://www.gimkit.com/assets/map/characters/spine/${id}.atlas`));
			if(res.headers.get("content-type")?.startsWith("text/html")) {
				error = "There is no gim with that id!";
				return;
			}
			let atlas = await res.text();
			let url = atlas.split("\n")[0];
			location.href = `https://www.gimkit.com/assets/map/characters/spine/${url}`;
		} catch {
			error = "An error occured!"
		}
	});
</script>

<div class="w-full flex items-center justify-center">
	<div class="rounded-xl bg-slate-800 text-3xl px-10 py-3 mt-2">
		{#if error}
			<div>{error}</div>
		{:else}
			<div>Loading...</div>
		{/if}
	</div>
</div>