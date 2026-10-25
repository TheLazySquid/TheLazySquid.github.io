<script lang="ts">
    import type { NamedAddress } from "$lib/babel";
    import { viewState } from "$lib/state.svelte";
    import { formatAddresses, parseAddresses } from "$lib/util";
    import Bookmark from "@lucide/svelte/icons/bookmark";
    import Plus from "@lucide/svelte/icons/plus";
    import Trash from "@lucide/svelte/icons/trash";

    const savedState = localStorage.getItem("babel-bookmarks");
    
    let drawerOpen = $state(false);
    let bookmarks: NamedAddress[] = $state(savedState ? parseAddresses(savedState) : []);
    
    function toggleDrawer() {
        drawerOpen = !drawerOpen;
    }

    function addBookmark() {
        const name = prompt("Enter a name for your bookmark");
        if(!name) return;
        
        bookmarks.push({
            name,
            shelf: viewState.shelf.toString(),
            row: viewState.row,
            book: viewState.book,
            page: viewState.page
        });

        localStorage.setItem("babel-bookmarks", formatAddresses(bookmarks));
    }

    function deleteBookmark(bookmark: NamedAddress, index: number) {
        if(!confirm(`Are you sure you want to delete the bookmark "${bookmark.name}"?`)) return;

        bookmarks.splice(index, 1);
        localStorage.setItem("babel-bookmarks", formatAddresses(bookmarks));
    }
</script>

<div
    class="fixed z-30 top-3 right-0 w-60 bg-backdrop rounded-bl-2xl p-3 transition-transform duration-300 text-yellow-200"
    class:translate-x-full={!drawerOpen}
>
    <div class="absolute top-0 right-full flex items-center justify-center p-3 rounded-l-2xl bg-backdrop">
        <button onclick={toggleDrawer}>
            <Bookmark size={28} />
        </button>
    </div>
    <div class="min-h-10 max-h-75 overflow-y-auto mb-2">
        {#if bookmarks.length === 0}
            <p>No pages bookmarked</p>
        {/if}
        {#each bookmarks as bookmark, index}
            <div class="flex items-center gap-2 break-words">
                <button class="grow text-left" onclick={() => viewState.jumpToAddress(bookmark)}>
                    {bookmark.name}
                </button>
                <button onclick={() => deleteBookmark(bookmark, index)}>
                    <Trash size={16} />
                </button>
            </div>
        {/each}
    </div>
    {#if viewState.open}
        <hr />
        <button class="flex items-center gap-2" onclick={addBookmark}>
            <Plus size={20} />
            Bookmark current page    
        </button>
    {/if}
</div>