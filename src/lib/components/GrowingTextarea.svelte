<script lang="ts">
    import { onMount } from "svelte";
    
    interface Props {
        padding: number;
        number?: boolean;
        placeholder?: string;
        value: string;
        onChange: (value: string) => void;
        maxlength?: number;
    }

    let { padding, number, placeholder, value, onChange, maxlength }: Props = $props();
    
    const numberRegex = /[0-9]/;
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
        if(number && e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey && !numberRegex.test(e.key)) {
            e.preventDefault();
        } else if(e.key === "Enter" && (number || !e.shiftKey)) {
            // Allow new lines when pressing shift and not a number input
            e.preventDefault();
            onValueChange();
        } else if(e.key === "Escape") {
            e.preventDefault();
            onValueChange();
        }
    }

    let textarea: HTMLTextAreaElement;
    function updateHeight() {
        textarea.style.height = "";
        textarea.style.height = (textarea.scrollHeight) + "px";
    }
    onMount(updateHeight);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<textarea class="resize-none outline-none -mx-[3px] wrap-break-word h-8 overflow-hidden
    {number ? "" : "border-b border-yellow-200 -my-px"}" use:autofocus spellcheck={false}
    style:width="{width}px" bind:value={value} {placeholder} bind:this={textarea} {maxlength}
    onchange={onValueChange} onkeydown={onKeydown} oninput={updateHeight} onblur={onValueChange}></textarea>