<script lang="ts">
    import Highlight from 'svelte-highlight';
    import javascript from 'svelte-highlight/languages/javascript';
    import onedark from 'svelte-highlight/styles/onedark';
    import parseHeader from '../lib/parseHeader'
    import { onMount } from 'svelte';

    const searchParams = new URLSearchParams(window.location.search);
    const installUrl = searchParams.get('installUrl');

    let GLInstallMissing = false;

    onMount(() => {
        GLInstallMissing = (window as any).GLInstall === undefined;
    })

    async function fetchScript() {
        if(GLInstallMissing) throw new Error('Gimloader not found');
        if(!installUrl) throw new Error('No install URL provided');

        const res = await fetch(installUrl);
        if(!res.ok) throw new Error(`Failed to fetch script: ${res.status}`);

        const script = await res.text();
        const header = parseHeader(script);

        document.title = `Install ${header.name} - Gimloader`

        return { script, header };
    }

    let installComplete = false;

    function installScript(script: string) {
        if(GLInstallMissing) return;

        (window as any).GLInstall(script);
        installComplete = true;
    }
</script>

<svelte:head>
    {@html onedark}
</svelte:head>

<div class="flex justify-center max-h-screen">
    <div class="p-5 max-h-full" style="max-width: min(90%, max(800px, 50%))">
        <div class="bg-slate-200 drop-shadow-lg rounded-lg p-5 h-full">
            {#if installComplete}
                <h1 class="w-full text-center font-bold text-5xl">Install Complete</h1>
                <p>You may now close this page.</p>
            {:else}
                {#if installUrl}
                    {#if !GLInstallMissing}
                        {#await fetchScript()}
                            <p>Loading script...</p>
                        {:then { script, header }}
                            <div class="flex flex-col h-full">
                                <h1 class="w-full text-center font-bold text-5xl">
                                    {header.name}
                                    {#if header.version}
                                        <span class="text-xl font-normal">v{header.version}</span>
                                    {/if}
                                </h1>
                                <h2 class="text-3xl w-full text-center">
                                    By {header.author}
                                </h2>
                                <p>
                                    {header.description}
                                </p>
                                <div class="overflow-y-auto mt-3 rounded-md">
                                    <Highlight language={javascript} code={script} />
                                </div>
                                <button on:click={() => installScript(script)}
                                class="bg-green-400 rounded-full mt-3 p-1">
                                    Install
                                </button>
                            </div>
                        {:catch error}
                            <h1 class="text-5xl font-bold w-full text-center">
                                Error Loading Script
                            </h1>
                            <p class="pt-3 text-xl">
                                {error.message}
                            </p>
                        {/await}
                    {:else}
                        <h1 class="text-5xl font-bold w-full text-center">
                            Gimloader Not Found
                        </h1>
                        <p>
                            Follow the instructions at
                            <a href="https://github.com/TheLazySquid/Gimloader"
                            class="underline text-blue-700"
                            target="_blank" rel="noopener noreferrer">
                                https://github.com/TheLazySquid/Gimloader
                            </a>
                            to install Gimloader. If you already have Gimloader, click
                            <a class="underline text-blue-700"
                            href="https://raw.githubusercontent.com/TheLazySquid/GimLoader/main/build/bundle.user.js">
                                here
                            </a>
                            to update it.
                        </p>
                    {/if}
                {:else}
                    <h1 class="text-5xl font-bold w-full text-center">
                        Invalid Install Link
                    </h1>
                    <p class="pt-3 text-xl">
                        This page is for installing Gimloader plugins from a link.
                        If you don't have a link to a plugin, there is nothing to do here.
                    </p>
                {/if}
            {/if}
        </div>
    </div>
</div>