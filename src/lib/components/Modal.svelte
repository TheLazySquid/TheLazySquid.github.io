<script lang="ts">
    import type { Snippet } from "svelte";
    import { fly } from "svelte/transition";

    interface Props {
        class?: string;
        open: boolean;
        children: Snippet;
        onClose?: () => void;
    }

    let { class: className = "", open = $bindable(), children, onClose }: Props = $props();

    function onClick(e: MouseEvent) {
        if((e.target as HTMLElement).closest(".modal-content")) return;
        
        open = false;
        onClose?.();
    }
</script>

<svelte:window onclick={onClick} />

<div class="fixed top-0 left-0 w-screen h-screen z-20
    {open ? "": "pointer-events-none opacity-0"} transition-opacity {className}">
    {#if open}
        <div transition:fly={{ y: 20, duration: 150 }}
            class="w-full h-dvh flex flex-col items-center justify-center py-3">
            <div class="modal-content contents">
                {@render children()}
            </div>
        </div>
    {/if}
</div>