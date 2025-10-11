<script lang="ts">
    import Shelf from "./Shelf.svelte";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import { state } from "./state.svelte";
    import Book from "./Book.svelte";
</script>

<Book />

{#snippet button(className: string, Icon: typeof ChevronRight, delta: bigint)}
    <button class="{className} fixed top-1/2 -translate-y-1/2 rounded-full flex justify-center items-center z-10"
        style="background-color: rgba(255, 255, 255, 0.7)" onclick={() => state.shelf += delta}>
        <Icon size={32} />
    </button>
{/snippet}

{#if state.shelf > 1n}
    {@render button("left-3", ChevronLeft, -1n)}
{/if}
{@render button("right-3", ChevronRight, 1n)}

<div class="h-full flex items-center justify-center overflow-hidden gap-10 user-select-none">
    <div class="pointer-events-none opacity-50">
        <Shelf shelf={state.shelf - 1n} />
    </div>
    <Shelf shelf={state.shelf} />
    <div class="pointer-events-none opacity-50">
        <Shelf shelf={state.shelf + 1n} />
    </div>
</div>