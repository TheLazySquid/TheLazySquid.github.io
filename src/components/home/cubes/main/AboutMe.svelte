<script lang="ts">
    import { switchTo } from "$lib/lib/stores";
    let optionsOpened = false;
    let numOptionsShown = 0;

    let options = [
        { text: "Me", cube: "aboutMe" },
        { text: "This Site", cube: "thisSite" },
        { text: "Contacting Me", cube: "links" }
    ]

    function updateOptionsShown() {
        if(optionsOpened) numOptionsShown++;
        else numOptionsShown = 0;

        if(numOptionsShown == 0 || numOptionsShown == options.length) return;
        setTimeout(updateOptionsShown, 100);
    }
    
    function toggleOptions() {
        optionsOpened = !optionsOpened;

        updateOptionsShown();            
    }
</script>

<div class="flex flex-col relative w-full h-full pl-40 pt-20">
    <div class="absolute flex flex-col items-start top-20 left-40 text-white text-7xl *:transition-opacity z-0">
        {#each options as option, i}
            <button class="hover:underline" on:click={() => switchTo.set(option.cube)}
            style="opacity: {numOptionsShown > i ? 1 : 0}">
                {option.text}
            </button>
        {/each}
    </div>
    <button class="text-white text-9xl underline transition-transform duration-300 text-left z-10"
        style={optionsOpened ? "transform: translateY(300px)" : ""}
        on:click={toggleOptions}>
        About...
    </button>
</div>