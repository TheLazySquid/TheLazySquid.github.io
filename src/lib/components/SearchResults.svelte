<script lang="ts">
    import { search, type Address } from "$lib/babel";
    import { formatShelf } from "$lib/util";
    import toast from "svelte-french-toast";
    import Modal from "./Modal.svelte";
    import Copy from "@lucide/svelte/icons/copy";
    import { viewState } from "$lib/state.svelte";

    interface Props {
        query: string;
        open: boolean;
    }

    let { query, open = $bindable() }: Props = $props();

    const results = $derived(search(query));
    const copy = (text: string) => {
        toast.promise(
            navigator.clipboard.writeText(text),
            {
                loading: "Copying shelf...",
                success: "Copied shelf to clipboard!",
                error: "Failed to copy shelf to clipboard"
            }
        );
    }

    const jump = (address: Address) => {
        viewState.shelf = BigInt(address.shelf);
        viewState.row = address.row;
        viewState.book = address.book;
        viewState.page = address.page;
        viewState.open = true;
        open = false;
    }
</script>

{#snippet result(address: Address, title: string)}
    <div class="pt-2">
        {title}
        (<button class="underline" onclick={() => jump(address)}>
            Jump
        </button>)
    </div>
    <div class="p-1 border rounded">
        <div class="flex items-center gap-3">
            Shelf: {formatShelf(address.shelf)}
            <button onclick={() => copy(address.shelf)} title="Copy to clipboard">
                <Copy size={16} />
            </button>
        </div>
        <p>Row: {address.row + 1}</p>
        <p>Book: {address.book + 1}</p>
        <p>Page: {address.page + 1}</p>
    </div>
{/snippet}

<Modal bind:open={open}>
    <div class="bg-backdrop-dark text-yellow-200 p-5 rounded-xl" style="width: min(90vw, 600px)">
        <h1 class="text-4xl w-full border-b mb-2">Search Results</h1>
        <p>Query:</p>
        <pre class="p-1 border rounded whitespace-pre-wrap wrap-break-word max-h-[200px] overflow-y-auto"
            style="scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.2) transparent;">{query}</pre>
        {@render result(results.middleAddress, "Match anywhere:")}
        {@render result(results.exactAddress, "Perfect match:")}
    </div>
</Modal>