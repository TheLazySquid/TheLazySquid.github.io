<script>
    import '../lib/GimkitIndex.js';
    import '../lib/Gimkit2dCode.js';
    import { Game, Scene } from 'phaser';
    import { onMount, onDestroy } from 'svelte';
    import * as Select from "$lib/components/ui/select";
    import * as Resizable from "$lib/components/ui/resizable";
    import GimFromImage from './GimFromImage.svelte';

    const animations = [['Running', 'run'], ['Idle', 'idle'], ['Jumping', 'jump']]

    let texture;
    let animation = { value: 'run', label: 'Running' };
    let gim;
    let mode = localStorage.getItem('gimCreatorMode') ?? 'basic';
    let lastFileUrl = null;

    $: if(gim) {
        gim.animationState.setAnimation(0, animation.value, true);
    }

    class PreviewScene extends Scene {
        preload() {
            this.load.spineJson('gim-data', '/baseGim/default_gray.json');
            this.load.spineAtlas('gim-atlas', '/baseGim/default_gray.atlas');
        }

        create() {
            gim = this.add.spine(400, 730, "gim-data", "gim-atlas");
            gim.setScale(2.5);
            gim.skeleton.setSkinByName('default_gray');
            gim.animationState.setAnimation(0, "run", true);

            let entries = this.cache.custom["esotericsoftware.spine.atlas.cache"].entries.entries;
            texture = entries["gim-atlas"].pages[0].texture;
        }
    }

    function updateSkin(file) {
        if(!texture) return;

        if(lastFileUrl) URL.revokeObjectURL(lastFileUrl);

        let url = URL.createObjectURL(file);
        lastFileUrl = url;
        texture._image.src = url;
        texture._image.addEventListener('load', () => {
            texture.update()
        }, { once: true })        
    }

    let canvasParent;
    let game;
    
    let spine = parcelRequire388b("38yEz");

    onMount(() => {
        const config = {
            type: Phaser.AUTO,
            scene: PreviewScene,
            plugins: {
                scene: [
                    // @ts-ignore
                    { key: 'SpinePlugin', plugin: spine.SpinePlugin, mapping: 'spine' }
                ]
            },
            width: 800,
            height: 800,
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

    let fileHandle;
    let supportsFsApi = 'showOpenFilePicker' in window;

    async function openFilePicker() {
        const files = await window.showOpenFilePicker({
            types: [
                { description: 'png files', accept: { 'image/png': ['.png'] } }
            ]
        }).catch();
        fileHandle = files[0];

        reloadFile();
    }

    function onFileClick() {
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = (e) => {
            let file = e.target.files?.[0];
            if(file) updateSkin(file);
        }

        input.click();
    }

    function onDrop(e) {
        e.preventDefault();
        let file = e.dataTransfer?.files?.[0];

        if(file) updateSkin(file);
    }

    function reloadFile() {
        if(!fileHandle) return;

        fileHandle.getFile().then(updateSkin);
    }

    let userImage = null;

    function onBasicDrop(e) {
        e.preventDefault();
        let file = e.dataTransfer?.files?.[0];

        if(file) userImage = file;
    }

    function onBasicFileClick() {
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = (e) => {
            let file = e.target.files?.[0];
            if(file) userImage = file;
        }

        input.click();
    }

    function onBasicSubmit(e) {
        let canvas = e.detail;
        canvas.toBlob((blob) => {
            updateSkin(blob);
        }, 'image/png');
        userImage = null;
    }

    function setMode(newMode) {
        localStorage.setItem('gimCreatorMode', newMode);
        mode = newMode;
    }
</script>

{#if userImage}
    <GimFromImage {userImage} on:submit={onBasicSubmit} on:cancel={() => userImage = null} />
{/if}

<Resizable.PaneGroup direction="horizontal" class="w-full h-full">
    <Resizable.Pane defaultSize={70} minSize={15}>
        <div bind:this={canvasParent} style="height: calc(100% - 35px)"></div>
        <div class="h-[35px] flex items-center pl-3">
            <Select.Root bind:selected={animation}>
                <Select.Trigger class="w-[200px] h-[35px]">
                    Animation:
                    <Select.Value />
                </Select.Trigger>
                <Select.Content>
                    {#each animations as [animName, id]}
                        <Select.Item value={id} label={animName}>
                            {animName}
                        </Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
    </Resizable.Pane>
    <Resizable.Handle />
    <Resizable.Pane minSize={15}>
        <div class="flex flex-col items-center border-l border-white h-full overflow-y-auto">
            <div class="flex w-full border-b border-b-white">
                <button on:click={() => setMode('basic')} class="flex-grow p-2"
                    class:bg-primary-foreground={mode === 'basic'}>
                    Basic
                </button>
                <button on:click={() => setMode('normal')} class="flex-grow p-2"
                    class:bg-primary-foreground={mode === 'normal'}>
                    Normal
                </button>
            </div>
            <h1 class="text-xl">Instructions</h1>
            <ol class="w-full p-2 [&>li]:mb-2 [&>li]:mt-2">
                {#if mode === 'normal'}
                    <li>1. Download the base gim texture
                        <a href="/baseGim/default_gray-v2.17.png" download
                        class="underline text-blue-600">
                            here.
                        </a>
                    </li>
                    <li>2. Open up the file in the image editor of your choice. I recommend
                        <a class="underline" href="https://www.gimp.org/" target="_blank">Gimp</a>.
                    </li>
                    <li>
                        3. Make whatever edits you want! To preview the Gim, export/overwrite the image and drag and drop it here.
                    </li>
                    <button class="border border-dashed border-white p-2 rounded-xl w-full"
                    on:drop={onDrop} on:dragover={(e) => e.preventDefault()}
                    on:click={onFileClick}>
                        Upload texture
                    </button>
                    <p>
                        Alternatively, if you are using browsers that support the file system access API
                        (Chrome, Edge and Opera at the moment) you can click the button below to open a file picker
                        and then simply export/overwrite to the same file and hit the reload button.
                    </p>
                    <button disabled={!supportsFsApi} title={!supportsFsApi ? 'Incompatible browser' : ''}
                    class="border border-white p-2 rounded-lg w-full mb-3 disabled:opacity-55"
                    on:click={openFilePicker}>
                        Open file picker
                    </button>
                    <button disabled={!supportsFsApi || !fileHandle} on:click={reloadFile}
                    title={!supportsFsApi ? 'Incompatible browser' : !fileHandle ? 'No file selected' : ''}
                    class="border border-white p-2 rounded-lg w-full disabled:opacity-55">
                        Reload
                    </button>
                    <li>
                        4. To use this in game, first download
                        <a href="https://github.com/TheLazySquid/Gimloader" class="underline">Gimloader</a>.
                        Then, simply click
                        <a class="underline"
                        href="/gimloader?installUrl=https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CharacterCustomization/build/CharacterCustomization.js">
                            on this link
                        </a>
                        to get the character customization plugin. Next, open Gimkit and hit alt + c to open the customization menu.
                        Underneath "skin" select "custom skin" and then click the "upload" button to upload the texture you just edited.
                        Afterwards, just load into a 2d game and you should see your custom Gim!
                    </li>
                {:else}
                    <li>1. Upload the image you want to turn into a skin below.</li>
                    <button class="border border-dashed border-white p-2 rounded-xl w-full"
                    on:drop={onBasicDrop} on:dragover={(e) => e.preventDefault()}
                    on:click={onBasicFileClick}>
                        Upload image
                    </button>
                    <li>
                        2. Download the generated spritesheet by clicking
                        {#if lastFileUrl}
                            <a class="underline" download="spritesheet.png" href={lastFileUrl}>
                                here.
                            </a>
                        {:else}
                            <span class="opacity-50 underline cursor-not-allowed" title="No file uploaded">
                                here.
                            </span>
                        {/if}
                    </li>
                    <li>
                        3. To use this in game, first download
                        <a href="https://github.com/TheLazySquid/Gimloader" class="underline">Gimloader</a>.
                        Then, simply click
                        <a class="underline"
                        href="/gimloader?installUrl=https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CharacterCustomization/build/CharacterCustomization.js">
                            on this link
                        </a>
                        to get the character customization plugin. Next, open Gimkit and hit alt + c to open the customization menu.
                        Underneath "skin" select "custom skin" and then click the "upload" button to upload the texture you just downloaded.
                        Afterwards, just load into a 2d game and you should see your custom Gim!
                    </li>
                {/if}
            </ol>
        </div>
    </Resizable.Pane>
</Resizable.PaneGroup>