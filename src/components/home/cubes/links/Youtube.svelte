<script lang="ts">
    import Link from '../../Link.svelte';
    import PopOut from '../../PopOut.svelte';
</script>

<PopOut on:offsetChange class="h-full w-full flex items-center justify-center">
    <Link href="https://www.youtube.com/@The_Lazy_Squid"
    class="flex gap-5 items-center hover:scale-110 transition-transform">
        <img src="/logos/youtube.png" class="h-32" alt="Youtube Icon" />
        <div class="text-white text-6xl underline">
            @The_Lazy_Squid
        </div>
    </Link>
</PopOut>