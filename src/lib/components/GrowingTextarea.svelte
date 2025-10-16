<script lang="ts">
    import { charsRegex } from "$lib/consts";
    import { onMount } from "svelte";
    
    interface Props {
        padding: number;
        number?: boolean;
        placeholder?: string;
        value: string;
        onCancel?: () => void;
        onChange: (value: string) => void;
        maxlength?: number;
    }

    let { padding, number, placeholder, value, onCancel, onChange, maxlength }: Props = $props();
    
    const numberRegex = /[^0-9]/;
    const characterWidth = 13.2;

    let windowWidth = $state(0);
    let maxWidth = $derived(windowWidth - padding);

    // Get the widest line
    let width = $derived.by(() => {
        let lengths = value.split("\n").map(str => str.length);
        let charsWide = Math.max(...lengths, 5) + 2;
        return Math.min(charsWide * characterWidth, maxWidth);
    });

    $effect(() => {
        width;
        updateHeight();
    });

    function autofocus(node: HTMLElement) {
        node.focus();
    }

    function onValueChange() {
        onChange(value);
    }

    function onKeydown(e: KeyboardEvent) {
        if(e.key === "Enter" && (number || !e.shiftKey)) {
            // Allow new lines when pressing shift and not a number input
            e.preventDefault();
            onValueChange();
        } else if(e.key === "Escape") {
            e.preventDefault();
            tryCancel();
        }
    }

    function onInput() {
        if(number) value = value.replace(numberRegex, "");
        else value = value.replace(charsRegex, "");

        updateHeight();
    }
    
    function tryCancel() {
        onCancel ? onCancel() : onValueChange();
    }

    let textarea: HTMLTextAreaElement;
    function updateHeight() {
        textarea.style.height = "";

        let height = textarea.scrollHeight;
        if(!number) height += 1;
        textarea.style.height = height + "px";
    }
    onMount(updateHeight);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<textarea class="resize-none outline-none -mx-[3px] wrap-break-word h-8 overflow-y-auto
    {number ? "" : "border-b border-yellow-200 -my-px"}" use:autofocus spellcheck={false}
    style:width="{width}px" bind:value={value} {placeholder} bind:this={textarea} {maxlength}
    style:max-height="calc(100vh - 132px)"
    onkeydown={onKeydown} oninput={onInput} onblur={tryCancel}></textarea>