<script lang="ts">
    let { children, ...props } = $props();
</script>

<a target="_blank" {...props}>{@render children()}</a>