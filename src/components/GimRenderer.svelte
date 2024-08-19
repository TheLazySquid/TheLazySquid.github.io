<script>
    import '../lib/GimkitIndex.js';
    import '../lib/Gimkit2dCode.js';

    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import { Game, Scene } from 'phaser';
    import { onDestroy, onMount } from 'svelte';
    import { decompress as decompressJSON } from 'compress-json';
    
    export let gimId;
    export let dirHandle;
    let gimIdTitleCase = gimId.charAt(0).toUpperCase() + gimId.slice(1);

    let done = false;

    class RenderScene extends Scene {
        preload() {
            this.load.baseURL = "https://corsproxy.io/?https://www.gimkit.com/assets/map/characters/spine/"
            let json = this.load.spineJson('gim-data', `${gimId}.json`);
            let atlas = this.load.spineAtlas('gim-atlas', `${gimId}.atlas`);

            // decompress the data because gimkit compresses it for some reason
            const decompress = () => {
                let value = this.cache.json.get("gim-data");
                if(value) {
                    const newVal = decompressJSON(value);
                    this.cache.json.add("gim-data", newVal);
                }
            }

            let atlasRunning = true;
            let jsonRunning = true;

            json.on("complete", () => {
                jsonRunning = false;
                if(!atlasRunning) decompress();  
            })

            atlas.on("complete", () => {
                atlasRunning = false;
                if(!jsonRunning) decompress();
            })
        }

        async create() {
            let subdirHandle = await dirHandle.getDirectoryHandle("run", { create: true });
            let frame = 0;
            let gim;
            let waiting = false;
            let skipFrame = false;

            let callback = game.loop.callback;
            const advance = function() {
                let time = game.loop.lastTime + 1000 / 60;
                callback.apply(game.loop, [time, 1000 / 60]);
                
                game.renderer.snapshot(async (img) => {
                    if(done) return;
                    if(waiting || skipFrame) {
                        skipFrame = false;
                        requestAnimationFrame(() => advance());
                        return;
                    }
                    let res = await fetch(img.src);
                    let blob = await res.blob();

                    // write the frame to the directory
                    const fileHandle = await subdirHandle.getFileHandle(`${frame}.png`, { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();
    
                    frame++;
                    advance();
                })
            }
            game.loop.callback = () => {};

            gim = this.add.spine(400, 730, "gim-data", "gim-atlas");
            gim.setScale(2.5);
            gim.skeleton.setSkinByName(gimId);

            let anim = "run";

            gim.animationState.setAnimation(0, "run", true);
            gim.animationState.addListener({
                complete: async () => {
                    if(done) return;
                    if(anim === "jump") {
                        done = true;

                        const batHandle = await dirHandle.getFileHandle("render.bat", { create: true });
                        const batWritable = await batHandle.createWritable();
                        await batWritable.write(`gifski --fps 60 -o ${gimIdTitleCase}Running.gif run/*.png\n` + 
                            `gifski --fps 60 -o ${gimIdTitleCase}Jumping.gif jump/*.png`);
                        await batWritable.close();

                        const shHandle = await dirHandle.getFileHandle("render.sh", { create: true });
                        const shWritable = await shHandle.createWritable();
                        await shWritable.write("#!/bin/bash\n" +
                            `gifski --fps 60 -o ${gimIdTitleCase}Running.gif run/*.png\n` + 
                            `gifski --fps 60 -o ${gimIdTitleCase}Jumping.gif jump/*.png`);
                        await shWritable.close();

                        return;
                    }

                    waiting = true;
                    subdirHandle = await dirHandle.getDirectoryHandle("jump", { create: true });
                    gim.animationState.setAnimation(0, "jump", true);
                    anim = "jump";
                    frame = 0;
                    waiting = false;
                    skipFrame = true;
                }
            })

            requestAnimationFrame(advance);
            requestAnimationFrame(() => advance());
        }
    }

    let spine = parcelRequire388b("38yEz");
    let game, canvasParent;

    onMount(() => {
        const config = {
            type: Phaser.AUTO,
            scene: RenderScene,
            plugins: {
                scene: [
                    // @ts-ignore
                    { key: 'SpinePlugin', plugin: spine.SpinePlugin, mapping: 'spine' }
                ]
            },
            width: 800,
            height: 800,
            backgroundColor: '#ffffff',
            parent: canvasParent,
            scale: {
                mode: Phaser.Scale.FIT
            }
        }

        game = new Game(config);
    })

    onDestroy(() => {
        game.destroy(true);
    })
</script>

<AlertDialog.Root bind:open={done}>
    <AlertDialog.Content>
        <AlertDialog.Title>Rendering Complete</AlertDialog.Title>
        <AlertDialog.Description>
            You can now combine the frames into a gif using any tool of your choosing. If you have
            <a href="https://gif.ski/" class="text-white underline">Gifski</a> installed, you can use one of the
            provided scripts to do it automatically.
            <br>
            This is a tool created for the 
            <a href="https://gimkit.wiki" class="underline text-white">Miraheze Gimkit Wiki</a>. Please do not
            upload gifs created with this tool to other wikis.
        </AlertDialog.Description>
        <AlertDialog.Footer>
            <AlertDialog.Action on:click={() => location.reload()}>Render Another</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<div bind:this={canvasParent}></div>