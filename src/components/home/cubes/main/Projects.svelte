<script lang="ts">
    import { switchTo } from "$lib/lib/stores";
</script>
<div class="w-full h-full flex items-center justify-center">
    <div class="flex items-center text-6xl gap-5">
        <input type="checkbox" class="w-24 h-24"
        on:click={() => switchTo.set('projects')} />
        View projects?
    </div>
</div>