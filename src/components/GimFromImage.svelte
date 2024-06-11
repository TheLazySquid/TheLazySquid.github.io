<script lang="ts">
    import * as Dialog from '$lib/components/ui/dialog';
    import { onDestroy, onMount } from 'svelte';
    import { Slider } from '$lib/components/ui/slider';
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';

    let dispatch = createEventDispatcher();
    export let userImage: File;

    let toLoad: Record<string, string> = {
        outline: '/baseGim/outline.png',
        userMask: '/baseGim/userMask.png',
        eyes: '/baseGim/eyes.png',
        bodyMask: '/baseGim/bodyMask.png',
        blankSpritesheet: '/baseGim/blankSpritesheet.png',
        leftLegMask: '/baseGim/leftLegMask.png',
        rightLegMask: '/baseGim/rightLegMask.png'
    }
    let images: Record<string, HTMLImageElement> = {};

    for(let key in toLoad) {
        images[key] = new Image();
        images[key].src = toLoad[key];
        images[key].onload = () => render();
    }

    let userImageOffset = { x: 0, y: 0 };
    let userImageScale = 1;
    let minScale = 1;

    let userImg = new Image();
    let userImgLoaded = false;
    userImg.src = URL.createObjectURL(userImage);

    onDestroy(() => {
        URL.revokeObjectURL(userImg.src);
    })

    userImg.onload = () => {
        userImgLoaded = true;
        // center the image
        userImageOffset = { x: (500 - userImg.width) / 2, y: (500 - userImg.height) / 2 };

        // make the image as small as possible while still being over 212x194
        minScale = Math.max(212 / userImg.width, 194 / userImg.height);
        userImageScale = minScale;
        
        render();
    }

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    onMount(() => {
        ctx = canvas.getContext('2d')!;
    })

    let includeEyes = true;

    let tempCanvas: OffscreenCanvas;
    let tempCtx: OffscreenCanvasRenderingContext2D;
    let isLoading = true;

    function render() {
        if(!ctx || !userImgLoaded) return;
        for(let key in images) {
            if(!images[key].complete) return;
        }
        isLoading = false;

        if(!tempCanvas) {
            tempCanvas = new OffscreenCanvas(500, 500);
            tempCtx = tempCanvas.getContext('2d')!;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw everything outside the mask at 20% opacity
        ctx.globalAlpha = 0.15;
        ctx.drawImage(userImg, userImageOffset.x, userImageOffset.y, userImg.width * userImageScale, userImg.height * userImageScale);
        ctx.globalAlpha = 1;

        tempCtx.clearRect(0, 0, 500, 500);
        tempCtx.globalCompositeOperation = 'source-over';
        tempCtx.drawImage(images.userMask, (500 - 212) / 2, (500 - 194) / 2, 212, 194);
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.drawImage(userImg, userImageOffset.x, userImageOffset.y, userImg.width * userImageScale, userImg.height * userImageScale);

        ctx.drawImage(tempCanvas, 0, 0);
        ctx.drawImage(images.outline, (500 - 212) / 2, (500 - 194) / 2, 212, 194);

        if(includeEyes) {
            ctx.drawImage(images.eyes, (500 - 212) / 2, (500 - 194) / 2, 212, 194);
        }
    }

    let dragging = false;

    function moveInbounds() {
        // clamp it so that the image is always inside the mask
        if(userImageOffset.x > (500 - 212) / 2) userImageOffset.x = (500 - 212) / 2;
        if(userImageOffset.y > (500 - 194) / 2) userImageOffset.y = (500 - 194) / 2;
        if(userImageOffset.x < 500 - (500 - 212) / 2 - userImg.width * userImageScale) userImageOffset.x = 500 - (500 - 212) / 2 - userImg.width * userImageScale;
        if(userImageOffset.y < 500 - (500 - 194) / 2 - userImg.height * userImageScale) userImageOffset.y = 500 - (500 - 194) / 2 - userImg.height * userImageScale;
    }

    function onMouseMove(e: MouseEvent) {
        if(!dragging) return;
        userImageOffset = { x: userImageOffset.x + e.movementX, y: userImageOffset.y + e.movementY };

        moveInbounds();

        render();
    }

    function createOutput() {
        let outputCanvas = document.createElement('canvas');
        outputCanvas.width = 512;
        outputCanvas.height = 1152;
        let outputCtx = outputCanvas.getContext('2d')!;

        // draw the user image to the temp canvas
        tempCtx.globalCompositeOperation = 'source-over';
        tempCtx.clearRect(0, 0, 500, 500);
        tempCtx.drawImage(images.bodyMask, (500 - 212) / 2, (500 - 194) / 2, 212, 194);
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.drawImage(userImg, userImageOffset.x, userImageOffset.y, userImg.width * userImageScale, userImg.height * userImageScale);

        // copy the body onto the spritesheet
        outputCtx.save();
        outputCtx.rotate(-Math.PI / 2);
        outputCtx.drawImage(tempCanvas, -963, 64);

        tempCtx.globalCompositeOperation = "copy";
        tempCtx.drawImage(images.leftLegMask, (500 - 212) / 2, (500 - 194) / 2, 212, 194);
        tempCtx.globalCompositeOperation = "source-in";
        tempCtx.drawImage(userImg, userImageOffset.x, userImageOffset.y, userImg.width * userImageScale, userImg.height * userImageScale);

        outputCtx.drawImage(tempCanvas, -771, -60);
        outputCtx.restore();

        tempCtx.globalCompositeOperation = "copy";
        tempCtx.drawImage(images.rightLegMask, (500 - 212) / 2, (500 - 194) / 2, 212, 194);
        tempCtx.globalCompositeOperation = "source-in";
        tempCtx.drawImage(userImg, userImageOffset.x, userImageOffset.y, userImg.width * userImageScale, userImg.height * userImageScale);

        outputCtx.drawImage(tempCanvas, 24, 270);
        outputCtx.drawImage(images.blankSpritesheet, 0, 0);
        
        if(!includeEyes) {
            outputCtx.clearRect(0, 1020, 182, 132);
        }

        ctx.clearRect(0, 0, 500, 500);
        ctx.drawImage(outputCanvas, 0, 0, 500, 500);

        return outputCanvas;
    }
</script>

<svelte:window on:mouseup={() => dragging = false} on:mousemove={onMouseMove} />

<Dialog.Root open closeOnOutsideClick={false} closeOnEscape={false}>
    <Dialog.Content class="!w-[590px] !max-w-full">
        <div class="bg-secondary p-5 w-[540px] h-[540px]">
            {#if isLoading}
                <h1 class="w-full text-3xl text-center">
                    Loading...
                </h1>
            {/if}
            <canvas width="500" height="500" bind:this={canvas} class:hidden={isLoading}
            on:mousedown={() => dragging = true}></canvas>
        </div>
        {#if userImgLoaded}
            <div class="flex items-center gap-3">
                Show eyes?
                <input type="checkbox" class="w-6 h-6"
                bind:checked={includeEyes} on:change={render} />
            </div>
            <div class="flex items-center justify-between">
                Small
                <Slider value={[userImageScale]} min={minScale} step={0.001} class="w-[80%]"
                max={minScale * 3.5} onValueChange={(val) => {
                    let newScale = val[0];
                    let ratio = newScale / userImageScale;

                    // Calculate the new offset to keep the fixed point in the same position relative to the image
                    userImageOffset = {
                        x: 250 - (250 - userImageOffset.x) * ratio,
                        y: 250 - (250 - userImageOffset.y) * ratio
                    };

                    // Update the image scale
                    userImageScale = newScale;
                    moveInbounds();

                    render();
                }} />
                Large
            </div>
            <Dialog.Footer>
                <Button type="reset" on:click={() => dispatch('cancel')}>Cancel</Button>
                <Button type="submit" on:click={() => {
                    dispatch('submit', createOutput());
                }}>Confirm</Button>
            </Dialog.Footer>
        {/if}
    </Dialog.Content>
</Dialog.Root>