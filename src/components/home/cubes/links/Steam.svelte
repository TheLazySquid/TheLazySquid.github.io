<script lang="ts">
    import Link from '../../Link.svelte';
    import PopOut from '../../PopOut.svelte';
</script>

<PopOut on:offsetChange class="h-full w-full flex items-center justify-center">
    <Link href="https://steamcommunity.com/id/the_lazy_squid/"
    class="flex gap-5 items-center hover:scale-110 transition-transform">
        <img src="/logos/steam.svg" class="w-32 h-32" alt="Steam Icon" />
        <div class="text-white text-6xl underline">
            the_lazy_squid
        </div>
    </Link>
</PopOut>