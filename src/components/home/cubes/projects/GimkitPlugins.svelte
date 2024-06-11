<script lang="ts">
    import { switchTo } from "$lib/lib/stores";
    import PopOut from "../../PopOut.svelte";


</script>

<div class="flex flex-col items-center justify-center w-full h-full">
    <PopOut on:offsetChange>
        <button class="p-5 bg-slate-700 rounded-3xl hover:scale-[2] transition-transform"
        on:click={() => switchTo.set("gimkit")}>
            <div>
                And a bunch of Gimkit plugins
            </div>
            <div>
                (All made with my own modloader)
            </div>
        </button>
    </PopOut>
</div>