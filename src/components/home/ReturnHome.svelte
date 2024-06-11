<script lang="ts">
    import { switchTo } from "../../lib/stores";
    import Home from 'svelte-material-icons/Home.svelte';
</script>

<div class="flex w-full h-full items-center justify-center text-white text-6xl">
    <button class="p-7 hover:scale-150 transition-transform rounded-full bg-slate-600"
    on:click={() => switchTo.set("main")}>
        <Home width={200} height={200} />
    </button>
</div>