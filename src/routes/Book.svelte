<script lang="ts">
    import { getPage } from "$lib/babel";
    import { pagesPerBook } from "$lib/consts";
    import { state } from "./state.svelte";
    import Markdown from "svelte-exmarkdown";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";

    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            state.open = false;
        }
    }

    function onPointerdown(e: PointerEvent) {
        if((e.target as HTMLElement).id === "bookbg") {
            state.open = false;
        }
    }
</script>

<svelte:window onkeydown={onKeydown} />

{#if state.open}
    <div class="fixed top-0 left-0 w-screen h-screen bg-black flex flex-col gap-10 items-center justify-center z-20"
        style="background-color: rgba(0, 0, 0, 0.8)" id="bookbg" onpointerdown={onPointerdown}>
        <div style="background-color: {state.color}; width: min(90%, 1200px);"
            class="h-[85%] rounded-4xl p-3 overflow-auto markdown">
            <Markdown md={getPage(state.shelf.toString(), state.row, state.book, state.page)} />
        </div>
        <div class="text-white text-2xl select-none font-semibold flex items-center gap-5">
            <button disabled={state.page === 0} class:opacity-50={state.page === 0}
                onclick={() => state.page--}>
                <ChevronLeft />
            </button>
            {state.page + 1 } / {pagesPerBook}
            <button disabled={state.page === pagesPerBook - 1} class:opacity-50={state.page === pagesPerBook - 1}
                onclick={() => state.page++}>
                <ChevronRight />
            </button>
        </div>
    </div>
{/if}

<style>
    .markdown :global(h1) {
        font-weight: bold;
        font-size: 2rem;
        margin-bottom: 0.5rem;
        border-bottom: 2px solid black;
    }

    .markdown :global(h2) {
        font-weight: bold;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .markdown :global(h3) {
        font-weight: 600;
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
    }

    .markdown :global(h4) {
        font-weight: 600;
        font-size: 1.15rem;
        margin-bottom: 0.5rem;
    }
</style>