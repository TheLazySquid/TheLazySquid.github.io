<script lang="ts">
    import { drawShelves, getBookAtPos } from "$lib/canvas";
    import { viewState } from "$lib/state.svelte";
    import { watch } from "runed";
    import { onMount } from "svelte";
    import { sineOut } from "svelte/easing";
    import { Tween } from "svelte/motion";

    let windowWidth = $state(0);
    let windowHeight = $state(0);

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    onMount(() => {
        ctx = canvas.getContext("2d")!;
        render();
    });

    const tweenDuration = 750;
    const maxOffset = 40n;
    const offset = new Tween(0, { duration: tweenDuration, easing: sineOut });
    let center = viewState.shelf;

    watch([() => windowWidth, () => windowHeight, () => offset.current], render, { lazy: true });
    watch(() => viewState.shelf, (value, prevValue) => {
        let distance = value - center;
        
        if(prevValue) {
            // If we try to move too much at once clamp it and teleport halfway through
            let delta = value - prevValue;
            if(delta > maxOffset || delta < -maxOffset) {
                if(distance > maxOffset) distance = maxOffset;
                else if(distance < -maxOffset) distance = -maxOffset;
    
                setTimeout(() => {
                    if(distance > 0n) center = value - maxOffset;
                    else center = value + maxOffset;
                }, tweenDuration / 2);
            }
        }

        offset.set(Number(distance)).then(() => {
            center = value;
            offset.set(0, { duration: 0 });
        });
    }, { lazy: true });

    function render() {
        if(!ctx) return;
        drawShelves(ctx, center, windowWidth, windowHeight, offset.current);
    }

    let cursor = $state("default");
    function onMousemove(e: MouseEvent) {
        let book = getBookAtPos(e.clientX, e.clientY, center, windowWidth, windowHeight, offset.current);
        if(!book) {
            cursor = "default";
            return;
        }
     
        cursor = "pointer";
        viewState.row = book.row;
        viewState.book = book.book;
    }

    function onClick(e: MouseEvent) {
        e.stopPropagation();
        
        let book = getBookAtPos(e.clientX, e.clientY, center, windowWidth, windowHeight, offset.current);
        if(!book) return;

        viewState.shelf = book.shelf;
        viewState.row = book.row;
        viewState.book = book.book;
        viewState.page = 0;
        viewState.open = true;
    }
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />
<canvas class="w-screen h-screen" bind:this={canvas} width={windowWidth} height={windowHeight}
    style="width: {windowWidth}px; height: {windowHeight}px; cursor: {cursor};"
    onclick={onClick} onmousemove={onMousemove}></canvas>