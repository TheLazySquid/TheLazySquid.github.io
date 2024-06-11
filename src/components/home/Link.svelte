<script lang="ts">
    import { linkingTo } from "../../lib/stores";

    export let href: string;
    let className: string = "";
    export { className as class };

    function onClick(event: MouseEvent) {
        if(event.ctrlKey) return;
        event.preventDefault();

        linkingTo.set(href);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<a {href} on:click={onClick}
    class={className}>
    <slot />
</a>