<script lang="ts">
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import Pencil from "@lucide/svelte/icons/pencil";
    import Search from "@lucide/svelte/icons/search";
    import { viewState } from "../lib/state.svelte";
    import Book from "../lib/components/Book.svelte";
    import GrowingTextarea from "$lib/components/GrowingTextarea.svelte";
    import SearchResults from "$lib/components/SearchResults.svelte";
    import { formatShelf } from "$lib/util";
    import { charsPerPage, charsRegex } from "$lib/consts";
    import toast from "svelte-french-toast";
    import Shelves from "$lib/components/Shelves.svelte";

    let editingShelf = $state(false);
    let searching = $state(false);
    let windowWidth = $state(0);
    let windowHeight = $state(0);
    
    function onShelfChange(value: string) {
        try {
            let valInt = BigInt(value);
            if(valInt < 1n) valInt = 1n;
            viewState.shelf = valInt;
            viewState.open = false;
        } catch {}

        editingShelf = false;
    }

    let resultsOpen = $state(false);
    let query = $state("");
    function onSearch(value: string) {
        searching = false;

        if(!value) return;
        value = value.replace(charsRegex, "");
        
        if(!value) {
            toast.error("Search is empty after removing illegal characters");
            return;
        }

        query = value;
        resultsOpen = true;
    }
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div class="fixed top-0 left-0 p-3 z-30">
    <div class="text-yellow-200 bg-backdrop rounded-xl p-2 text-2xl/8 font-mono">
        <div class="flex items-center gap-4 w-full">
            Shelf:
            {#if editingShelf}
                <GrowingTextarea number={true} padding={175} maxlength={charsPerPage * 2}
                    value={viewState.shelf.toString()} onChange={onShelfChange} />
            {:else}
                {formatShelf(viewState.shelf.toString())}
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
        <div class="flex items-center gap-4">
            Search
            {#if searching}
                <GrowingTextarea value="" padding={175} maxlength={charsPerPage}
                    onChange={onSearch} placeholder="..." onCancel={() => searching = false} />
            {/if}
            <button onclick={() => searching = true}>
                <Search size={20} />
            </button>
        </div>
    </div>
</div>

<Book />
<SearchResults {query} bind:open={resultsOpen} />

{#snippet button(className: string, Icon: typeof ChevronLeft, delta: bigint)}
    <button class="{className} fixed top-1/2 -translate-y-1/2 rounded-full flex justify-center items-center z-10"
        style="background-color: rgba(255, 255, 255, 0.7)" onclick={() => viewState.shelf += delta}>
        <Icon size={32} />
    </button>
{/snippet}

{#if viewState.shelf > 1n}
    {@render button("left-3", ChevronLeft, -1n)}
{/if}
{@render button("right-3", ChevronRight, 1n)}

<Shelves />