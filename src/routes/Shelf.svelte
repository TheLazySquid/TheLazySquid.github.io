<script lang="ts">
    import { booksPerRow, rowsPerShelf } from "$lib/consts";
    import PRNG from "$lib/rng";
    import { watch } from "runed";
    import { state } from "./state.svelte";

    let { shelf }: { shelf: bigint } = $props();
    const colors = ["#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6", "#f97316"];
    
    const rng = new PRNG(shelf.toString());
    watch(() => shelf, () => {
        rng.setSeed(shelf.toString());
    }, { lazy: true });

    function openBook(row: number, book: number, color: string) {
        state.row = row;
        state.book = book;
        state.color = color;
        state.page = 0;
        state.open = true;
    }
</script>

<div class="border-amber-700 border-b-0 border-8 min-w-max">
    {#each { length: rowsPerShelf }, row}
        <div class="flex border-amber-700 border-b-8 pt-3 items-end">
            {#each { length: booksPerRow }, book}
                {@const color = colors[rng.random(colors.length)]}
                <button onclick={() => openBook(row, book, color)}>
                    {#key shelf}
                        <img src="/books/{rng.randomRange(1, 7)}.svg" alt="Book"
                            class="w-[30px] mask-no-repeat" 
                            style:mask-size="100% 100%"
                            style:mask-image="url(/books/mask.svg)"
                            style:height="{rng.randomRange(140, 160)}px"
                            style:background-color={color} />
                    {/key}
                </button>
            {/each}
        </div>
    {/each}
</div>