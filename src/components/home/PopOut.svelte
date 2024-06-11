<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { spring } from "svelte/motion";

    export let stiffness: number = 0.1;
    export let damping: number = 0.1;
    export let offsetDistance: number = 1;
    let className: string = "";
    export { className as class };

    let dispatch = createEventDispatcher();

    let offset = spring(0, {
        stiffness,
        damping
    });

    let destroyed = false;
    onDestroy(() => destroyed = true);

    offset.subscribe((value) => {
        if (destroyed) return;
        dispatch("offsetChange", value);
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-mouse-events-have-key-events -->
<div on:mouseover={() => offset.set(offsetDistance)}
    on:mouseout={() => offset.set(0)}
    class={className}>
    <slot />
</div>