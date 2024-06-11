<script lang="ts">
    import Link from '../../Link.svelte';
    import PopOut from '../../PopOut.svelte';
</script>

<PopOut on:offsetChange class="h-full w-full flex items-center justify-center">
    <Link href="https://github.com/TheLazySquid"
    class="flex gap-5 items-center hover:scale-110 transition-transform">
        <img src="/logos/github.png" class="w-32 h-32" alt="Github Icon" />
        <div class="text-white text-6xl underline">
            TheLazySquid
        </div>
    </Link>
</PopOut>