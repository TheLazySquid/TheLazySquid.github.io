<script lang="ts">
    import Link from '../../Link.svelte';

    export let link: string;
    export let name: string;
</script>

<div>
    <h1 class="flex border-b-2 border-white items-center p-4">
        <div class="flex-grow text-center text-6xl font-bold">
            {name}
        </div>
        <Link href={link}>
            <img src="/logos/github.png" alt="Github logo" class="w-24 h-24" />
        </Link>
    </h1>
    <div class="flex justify-center">
        <div class="w-1/2 pt-5">
            <slot />
        </div>
    </div>
</div>