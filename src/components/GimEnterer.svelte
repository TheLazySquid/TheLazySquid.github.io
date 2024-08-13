<script lang="ts">
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    // @ts-ignore
    import Spinner from 'svelte-spinner';
    import GimRenderer from './GimRenderer.svelte';
    import { fade } from 'svelte/transition';
    import { makeCorsUrl } from '../util/net';

    let supportsFsApi = 'showDirectoryPicker' in window;
    let gimId: string;
    let loading = false;
    let failedOpen = false;
    let selectDirOpen = false;

    function verify() {
        if(!gimId) return;
        loading = true;

        const assetUrl = `https://www.gimkit.com/assets/map/characters/spine/${gimId}.atlas`

        fetch(makeCorsUrl(assetUrl))
            .then(res => {
                // check if we got a 404 page
                if(res.headers.get("content-type")?.startsWith("text/html")) {
                    failedOpen = true;
                } else {
                    selectDirOpen = true;
                }
            })
            .catch(() => failedOpen = true)
            .finally(() => loading = false)
    }

    let dirHandle: FileSystemDirectoryHandle;

    function selectDir() {
        window.showDirectoryPicker()
            .then((handle) => {
                dirHandle = handle;
                selectDirOpen = false;
            })
            .catch(() => {});
    }
</script>

{#if !supportsFsApi}
    <AlertDialog.Root open>
        <AlertDialog.Content>
            <AlertDialog.Title>Unsupported Browser</AlertDialog.Title>
            <AlertDialog.Description>
                Your browser does not support the
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API"
                class="text-white underline">File System API.</a>
                Please use a browser such as Chrome or Edge that supports this API.
            </AlertDialog.Description>
        </AlertDialog.Content>
    </AlertDialog.Root>
{/if}

{#if dirHandle}
    <div transition:fade={{ duration: 300, delay: 300 }}>
        <GimRenderer {gimId} {dirHandle} />
    </div>
{:else}
    <div transition:fade={{ duration: 300 }}
    class="w-full h-[80%] flex flex-col items-center justify-center gap-3">
        <h1 class="text-xl">Enter the Gim's ID</h1>
        <div class="relative flex gap-3 items-center">
            <Input placeholder="default_gray" bind:value={gimId} autofocus
            on:keydown={(e) => {
                if(e.key === "Enter") verify();
            }} />
            <Button on:click={verify}>Submit</Button> 
            {#if loading}
                <div class="absolute top-1/2 left-[105%] -translate-y-1/2 transform">
                    <Spinner color="white" size={40} />
                </div>
            {/if}
        </div>
    </div>
{/if}

<Dialog.Root bind:open={failedOpen}>
    <Dialog.Content>
        <Dialog.Title>Invalid ID</Dialog.Title>
        <Dialog.Description>
            The Gim ID you entered could not be found.
        </Dialog.Description>
    </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={selectDirOpen}>
    <Dialog.Content>
        <Dialog.Title>Select folder for frames to be outputted in</Dialog.Title>
        <Button on:click={selectDir}>Select</Button>
    </Dialog.Content>
</Dialog.Root>