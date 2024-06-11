<script lang="ts">
    import PopOut from '$lib/components/home/PopOut.svelte';
</script>

<div class="flex justify-center items-center w-full h-full">
    <div class="text-2xl text-white w-1/2">
        Thanks to Threlte, the sides of the cube are just normal HTML elements
        (or in this case Svelte components) that magically work in 3D.

        <PopOut offsetDistance={5} on:offsetChange>
            <div class="rounded-xl bg-slate-600 p-5 mt-4 cursor-pointer">
                I also added the ability to have
                a side pop out for added flare.
                Hover me to see it in action.
            </div>
        </PopOut>
    </div>
</div>