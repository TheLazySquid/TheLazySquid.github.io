<script lang="ts">
    import { getPage } from "$lib/babel";
    import { pagesPerBook } from "$lib/consts";
    import { viewState } from "../state.svelte";
    import Markdown from "svelte-exmarkdown";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import ClipboardCopy from "@lucide/svelte/icons/clipboard-copy";
    import { watch } from "runed";
    import Link from "./markdown/Link.svelte";
    import Modal from "./Modal.svelte";
    import { fly } from "svelte/transition";
    import toast from "svelte-french-toast";

    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            viewState.open = false;
            viewState.save();
        }
    }

    let pageVal: string | number = $state(viewState.page + 1);
    watch(() => viewState.page, () => {
        pageVal = viewState.page + 1;
    });

    function movePage(delta: number) {
        viewState.page += delta;
        viewState.save();
    }

    function onPageChange() {
        let page = parseInt(pageVal as string);
        if(isNaN(page)) {
            pageVal = viewState.page + 1;
        } else {
            page = Math.min(Math.max(page, 1), pagesPerBook) - 1;
            viewState.page = page;
            viewState.save();
        }
    }

    function copyUrl(e: MouseEvent) {
        e.stopPropagation();

        const params = new URLSearchParams();
        params.set("shelf", viewState.shelf.toString());
        params.set("row", viewState.row.toString());
        params.set("book", viewState.book.toString());
        params.set("page", viewState.page.toString());
        params.set("open", viewState.open ? "true" : "false");

        const url = `${location.origin}${location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url)
            .then(() => toast.success("Copied url to clipboard"))
            .catch(() => toast.error("Failed to copy url"));
    }
</script>

<svelte:window onkeydown={onKeydown} />

{#if viewState.open}
    <button class="bg-backdrop fixed left-4 bottom-4 rounded-full p-3 text-yellow-200 z-50"
        transition:fly={{ y: 20, duration: 150 }} onclick={copyUrl}>
        <ClipboardCopy size={24} />
    </button>
{/if}

<Modal class="bg-backdrop" bind:open={viewState.open} onClose={() => viewState.save()}>
    <div style="width: min(90%, 600px);" class="flex-grow min-h-0 bg-amber-100 rounded-md p-3 max-h-[800px]">
        <div class="markdown break-words overflow-auto h-full"
            style="scrollbar-color: rgba(0, 0, 0, 0.5) transparent;">
            <Markdown md={getPage(viewState.shelf.toString(), viewState.row, viewState.book, viewState.page)}
                plugins={[{ renderer: { a: Link } }]}/>
        </div>
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