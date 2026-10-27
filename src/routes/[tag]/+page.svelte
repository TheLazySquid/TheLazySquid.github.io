<script lang="ts">
    import type { State } from '$lib/state.svelte.js';
    import Interface from '$lib/components/Interface.svelte';
    import { resetUrl } from '$lib/util.js';

    let { data } = $props();
    resetUrl();
</script>

<Interface initialState={data.initialState} />