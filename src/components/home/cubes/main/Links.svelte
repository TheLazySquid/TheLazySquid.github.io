<script lang="ts">
    import { switchTo } from "../../../../lib/stores";
import PopOut from "../../PopOut.svelte";
</script>

<div class="flex items-center justify-center w-full h-full noMax">
    <PopOut offsetDistance={3} on:offsetChange>
        <button class="bg-slate-800 text-white rounded-full p-24 pt-10
        pb-10 text-9xl hover:scale-[2] transition-transform duration-150"
        on:click={() => switchTo.set("links")}>
            Links
        </button>
    </PopOut>
</div>