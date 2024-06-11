<script lang="ts">
    import { switchTo } from "../../../../lib/stores";
</script>

<div class="flex justify-center">
    <p class="text-white w-3/5 text-xl mt-8">
        Hey! I do a bunch of random stuff with computers, mostly related to Javascript and the web.
        Most of the stuff you'll find here or on my Github is going to be a tampermonkey Userscript.
        <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
        <span class="underline text-left cursor-pointer" on:click={() => switchTo.set("projects")}>
            Click here to see some of my projects.
            </span>
        I also play quite a few PC games, with some favorites (as of writing)
        being TF2, Minecraft and Helldivers 2. When it comes to webdev, I'm a fan of
        Svelte, Tailwind and Astro (which this site is build with).
        <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
        <span class="underline text-left cursor-pointer" on:click={() => switchTo.set("thisSite")}>
            More information about this site here.
        </span>
    </p>
</div>