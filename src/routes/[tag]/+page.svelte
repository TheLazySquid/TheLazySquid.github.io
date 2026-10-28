<script lang="ts">
    import Interface from "$lib/components/Interface.svelte";

    let { data } = $props();
</script>

<Interface initialState={data.initialState} />