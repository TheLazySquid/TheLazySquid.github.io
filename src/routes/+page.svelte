<script lang="ts">
    import Shelf from "./Shelf.svelte";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import Pencil from "@lucide/svelte/icons/pencil";
    import { viewState } from "./state.svelte";
    import Book from "./Book.svelte";

    let editingShelf = $state(false);
    let shelfVal = $state(viewState.shelf.toString());

    const shelfPadding = 180;
    const characterWidth = 13.2;
    const lineHeight = 32;
    let windowWidth = $state(0);
    let maxWidth = $derived(windowWidth - shelfPadding);
    let shelfWidth = $derived(Math.min((shelfVal.length + 5) * characterWidth, maxWidth));
    let shelfHeight = $derived(Math.ceil((shelfVal.length + 5) * characterWidth / maxWidth) * lineHeight);

    function formatShelf(shelf: bigint) {
        let string = shelf.toString();
        if(string.length <= 6) return string;
        return string.slice(0, 3) + "..." + string.slice(-3);
    }

    function onShelfChange() {
        try {
            let shelf = BigInt(shelfVal);
            if(shelf < 1n) shelf = 1n;
            viewState.shelf = shelf;
        } catch {}

        shelfVal = viewState.shelf.toString();
    }

    const numberRegex = /[0-9]/;
    function onShelfInput(e: KeyboardEvent) {
        if(e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey && !numberRegex.test(e.key)) {
            e.preventDefault();
        } else if(e.key === "Enter") {
            e.preventDefault();
            onShelfChange();
            editingShelf = false;
        } else if(e.key === "Escape") {
            e.preventDefault();
            shelfVal = viewState.shelf.toString();
            editingShelf = false;
        }
    }

    function autofocus(node: HTMLElement) {
        node.focus();
    }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="fixed top-0 left-0 p-3 z-30">
    <div class="text-yellow-200 bg-backdrop rounded-xl p-2 text-2xl/8 font-mono">
        <div class="flex items-center gap-4 w-full">
            Shelf:
            {#if editingShelf}
                <textarea class="resize-none grow h-8 p-0 outline-none -ml-[3px]" bind:value={shelfVal}
                    style="width: {shelfWidth}px; height: {shelfHeight}px;" use:autofocus
                    onchange={onShelfChange} onkeydown={onShelfInput} onblur={() => editingShelf = false}></textarea>
            {:else}
                {formatShelf(viewState.shelf)}
            {/if}
            <button onclick={() => editingShelf = true}>
                <Pencil size={20} />
            </button>
        </div>
        {#if viewState.row !== null}
            <div>Row: {viewState.row + 1}</div>
        {/if}
        {#if viewState.book !== null}
            <div>Book: {viewState.book + 1}</div>
        {/if}
    </div>
</div>

<Book />

{#snippet button(className: string, Icon: typeof ChevronRight, delta: bigint)}
    <button class="{className} fixed top-1/2 -translate-y-1/2 rounded-full flex justify-center items-center z-10"
        style="background-color: rgba(255, 255, 255, 0.7)" onclick={() => viewState.shelf += delta}>
        <Icon size={32} />
    </button>
{/snippet}

{#if viewState.shelf > 1n}
    {@render button("left-3", ChevronLeft, -1n)}
{/if}
{@render button("right-3", ChevronRight, 1n)}

<div class="h-full flex items-center justify-center overflow-hidden gap-10 user-select-none">
    <div class="pointer-events-none opacity-50">
        <Shelf shelf={viewState.shelf - 1n} />
    </div>
    <Shelf shelf={viewState.shelf} />
    <div class="pointer-events-none opacity-50">
        <Shelf shelf={viewState.shelf + 1n} />
    </div>
</div>