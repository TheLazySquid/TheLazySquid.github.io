<script lang="ts">
    import '../lib/SpinePlugin.js';
    import { Game, type Types, Scene } from 'phaser';
    import 'phaser/types/spineplugin.d.ts';
    import { onMount, onDestroy } from 'svelte';

    let texture: any;
    let animation: string = 'run';
    let gim: any;

    $: if(gim) {
            gim.setAnimation(0, animation, true);
        }

    class PreviewScene extends Scene {
        preload() {
            this.load.spine('gim', 'baseGim/default_gray.json', 'baseGim/default_gray.atlas')
        }

        create() {
            gim = this.add.spine(400, 730, 'gim', animation, true)
            gim.setScale(2.5);
            gim.setSkinByName('default_gray');

            texture = gim.plugin.spineTextures.entries.entries['gim'].pages[0].texture
        }
    }

    function updateSkin(file: File) {
        if(!texture) return;

        if(texture._image.src.startsWith('blob')) URL.revokeObjectURL(texture._image.src);

        texture._image.src = URL.createObjectURL(file);
        texture._image.addEventListener('load', () => {
            texture.update()
        }, { once: true })        
    }

    let canvasParent: HTMLDivElement;

    let game: Game;
    
    onMount(() => {
        const config: Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scene: PreviewScene,
            plugins: {
                scene: [
                    // @ts-ignore
                    { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
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

    let fileHandle: FileSystemFileHandle;
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
            let file = (e.target as HTMLInputElement).files?.[0];
            if(file) updateSkin(file);
        }

        input.click();
    }

    function onDrop(e: DragEvent) {
        e.preventDefault();
        let file = e.dataTransfer?.files?.[0];

        if(file) updateSkin(file);
    }

    function reloadFile() {
        if(!fileHandle) return;

        fileHandle.getFile().then(updateSkin);
    }
</script>

<div class="w-full h-full flex flex-row">
    <div style="width: calc(100% - 350px)">
        <div bind:this={canvasParent} style="height: calc(100% - 25px)"></div>
        <div class="h-[25px] flex items-center pl-3">
            <p>Animation:</p>
            <select bind:value={animation}>
                <option value="run">Running</option>
                <option value="idle">Idle</option>
                <option value="jump">Jumping</option>
            </select>
        </div>
    </div>
    <div class="flex flex-col w-[350px] items-center border-l-2 border-black h-full overflow-y-auto">
        <h1 class="text-xl">Instructions</h1>
        <ol class="w-full p-2">
            <li>1. Download the base gim texture
                <a href="/baseGim/default_gray-v2.21.png" download
                class="underline text-blue-600">
                    here
                </a>
            </li>
            <li>2. Open up the file in the image editor of your choice. I recommend
                <a class="underline" href="https://www.gimp.org/">Gimp</a>.
            </li>
            <li>
                3. Make whatever edits you want! To preview the Gim, export/overwrite the image and drag and drop it here.
            </li>
            <button class="border border-dashed border-black p-2 rounded-xl w-full"
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
            class="border border-black p-2 rounded-lg w-full mb-3 disabled:opacity-55"
            on:click={openFilePicker}>
                Open file picker
            </button>
            <button disabled={!supportsFsApi || !fileHandle} on:click={reloadFile}
            title={!supportsFsApi ? 'Incompatible browser' : !fileHandle ? 'No file selected' : ''}
            class="border border-black p-2 rounded-lg w-full disabled:opacity-55">
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
        </ol>
    </div>
</div>