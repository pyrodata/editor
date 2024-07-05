<script lang="ts">
    import type { EditorProps } from "./index.svelte";
    import { Editor } from "@tiptap/core";
    import { StarterKit } from "@tiptap/starter-kit";
    import { onMount } from "svelte";
    import Toolbar from "./Toolbar.svelte";
    import Link from "@tiptap/extension-link";

    let { buttons, value }: EditorProps = $props();

    let element = $state<HTMLDivElement>();
    let editor = $state<Editor>();

    onMount(() => {
        editor = new Editor({
            element,
            extensions: [
                Link.configure({
                    openOnClick: false
                }),
                StarterKit
            ],
            content: "<p>Hello World! 🌍️ </p>",
            onTransaction: () => {
                // force re-render so `editor.isActive` works as expected
                const bk = editor;

                editor = undefined;
                editor = bk;

                value = editor?.getHTML() ?? null;
            },
        });
    });
</script>

<input
    type="text"
    class="
        p-2 px-4 mb-6 w-full border-2 border-gray-300 rounded-3xl *:outline-none
        focus:border-black focus:ring-4 focus:ring-gray-300
    "
    value="Potassium nitrate"
/>
<div
    bind:this={element}
    class="
        border border-gray-100 rounded-3xl *:outline-none
        has-[.ProseMirror-focused]:border-black
        [&>.ProseMirror]:px-4
    "
>
    {#if editor}
        <Toolbar {editor} {buttons} />
    {/if}
</div>
