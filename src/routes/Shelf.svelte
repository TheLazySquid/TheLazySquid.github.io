<script lang="ts">
    import { booksPerRow, rowsPerShelf } from "$lib/consts";
    import PRNG from "$lib/rng";
    import { watch } from "runed";
    import { viewState } from "./state.svelte";

    let { shelf }: { shelf: bigint } = $props();
    const colors = ["#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6", "#f97316"];
    const red = "#ff0713";
    
    const rng = new PRNG(shelf.toString());
    watch(() => shelf, () => {
        rng.setSeed(shelf.toString());
    }, { lazy: true });

    function openBook(row: number, book: number) {
        viewState.row = row;
        viewState.book = book;
        viewState.page = 0;
        viewState.open = true;
    }

    function hoverBook(row: number, book: number) {
        viewState.row = row;
        viewState.book = book;
    }

    const halfwayRow = Math.floor(rowsPerShelf / 2);
    const halfwayBook = Math.floor(booksPerRow / 2);
</script>

<div class="border-amber-700 border-b-0 border-8 min-w-max">
    {#each { length: rowsPerShelf }, row}
        <div class="flex border-amber-700 border-b-8 pt-3 items-end">
            {#each { length: booksPerRow }, book}
                {@const special = shelf === 1n && row === halfwayRow && book === halfwayBook}
                <button onclick={() => openBook(row, book)}
                    onpointerover={() => hoverBook(row, book)}>
                    {#key shelf}
                        <img src="/books/{special ? 2 : rng.randomRange(1, 7)}.svg" alt="Book"
                            class="w-[30px] mask-no-repeat" 
                            style:mask-size="100% 100%"
                            style:mask-image="url(/books/mask.svg)"
                            style:height="{special ? 100 : rng.randomRange(140, 160)}px"
                            style:background-color={special ? red : colors[rng.random(colors.length)]} />
                    {/key}
                </button>
            {/each}
        </div>
    {/each}
</div>