<script lang="ts">
    import Interface from "$lib/components/Interface.svelte";
    import { loadStateFromSearch } from "$lib/state.svelte";
</script>

<Interface initialState={loadStateFromSearch()} />