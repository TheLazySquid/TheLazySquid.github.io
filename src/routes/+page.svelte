<script lang="ts">
    import Interface from "$lib/components/Interface.svelte";
    import { loadSaved } from "$lib/state.svelte";
</script>

<Interface initialState={loadSaved()} />