<script lang="ts">
    import { getPage } from "$lib/babel";
    import { pagesPerBook } from "$lib/consts";
    import { viewState } from "../state.svelte";
    import Markdown from "svelte-exmarkdown";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import { watch } from "runed";
    import Link from "./markdown/Link.svelte";
    import Modal from "./Modal.svelte";

    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            viewState.open = false;
        }
    }

    function onPointerdown(e: PointerEvent) {
        if((e.target as HTMLElement).id === "bookbg") {
            viewState.open = false;
        }
    }

    let pageVal: string | number = $state(viewState.page + 1);
    watch(() => viewState.page, () => {
        pageVal = viewState.page + 1;
    });

    function movePage(delta: number) {
        viewState.page += delta;
    }

    function onPageChange() {
        let page = parseInt(pageVal as string);
        if(isNaN(page)) {
            pageVal = viewState.page + 1;
        } else {
            page = Math.min(Math.max(page, 1), pagesPerBook) - 1;
            viewState.page = page;
        }
    }
</script>

<svelte:window onkeydown={onKeydown} />

<Modal class="bg-backdrop" bind:open={viewState.open}>
    <div style="width: min(90%, 600px);"
        class="h-[85%] bg-amber-100 rounded-4xl p-3 overflow-hidden markdown break-words">
        <Markdown md={getPage(viewState.shelf.toString(), viewState.row, viewState.book, viewState.page)}
            plugins={[{ renderer: { a: Link } }]}/>
    </div>
    <div class="text-white text-2xl select-none font-semibold flex items-center gap-5">
        <button disabled={viewState.page === 0} class:opacity-50={viewState.page === 0}
            onclick={() => movePage(-1)}>
            <ChevronLeft />
        </button>
        <input type="text" class="w-[50px] border-b border-white outline-none"
            pattern="[0-9]*" maxlength="3"
            bind:value={pageVal} onchange={onPageChange} />
        / {pagesPerBook}
        <button disabled={viewState.page === pagesPerBook - 1} class:opacity-50={viewState.page === pagesPerBook - 1}
            onclick={() => movePage(1)}>
            <ChevronRight />
        </button>
    </div>
</Modal>

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

    .markdown :global(a) {
        color: blue;
        text-decoration: underline;
    }
</style>