<script lang="ts">
    import {
        Bold,
        Heading,
        Heading2,
        Heading3,
        Heading4,
        Heading5,
        Heading6,
        ImagePlus,
        Italic,
        Link,
        Strikethrough,
    } from "lucide-svelte";
    import Button from "./Button.svelte";
    import { classNames, DropdownItem, type EditorToolbarProps } from "./index.svelte.js";
    import ButtonDropdown from "./ButtonDropdown.svelte";
    import ButtonDialog from "./ButtonDialog.svelte";
    import Input from "./Input.svelte";

    const {
        buttons = "heading,bold,italic,strikethrough|link",
        editor,
    }: EditorToolbarProps = $props();

    const groups = buttons.split("|").map((group) => group.split(","));
    const url = $state({
        active: false,
        text: '',
        link: ''
    });

    $effect(() => {
        console.log(url.text)
    })
</script>

<div class="flex py-2 px-3 items-center bg-white border-b-1 border-gray-300 sticky top-0 z-10 rounded-ss-3xl rounded-se-3xl">
    {#each groups as group, i}
        <div class="flex items-center">
            {#each group as button}
                {#if button === "heading"}
                    <ButtonDropdown icon={Heading} title="Heading">
                        <DropdownItem>
                            <Button
                                icon={Heading2}
                                title="H2"
                                onclick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()}
                            />
                        </DropdownItem>
                        <DropdownItem>
                            <Button
                                icon={Heading3}
                                title="H3"
                                onclick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 3 })
                                        .run()}
                            />
                        </DropdownItem>
                        <DropdownItem>
                            <Button
                                icon={Heading4}
                                title="H4"
                                onclick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 4 })
                                        .run()}
                            />
                        </DropdownItem>
                        <DropdownItem>
                            <Button
                                icon={Heading5}
                                title="H5"
                                onclick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 5 })
                                        .run()}
                            />
                        </DropdownItem>
                        <DropdownItem>
                            <Button
                                icon={Heading6}
                                title="H6"
                                onclick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 6 })
                                        .run()}
                            />
                        </DropdownItem>
                    </ButtonDropdown>
                {/if}
                {#if button === "bold"}
                    <Button
                        icon={Bold}
                        title="Toggle bold"
                        onclick={() => console.log("NOT IMPLEMENTED")}
                    />
                {/if}
                {#if button === "italic"}
                    <Button
                        icon={Italic}
                        title="Toggle italic"
                        onclick={() => console.log("NOT IMPLEMENTED")}
                    />
                {/if}
                {#if button === "strikethrough"}
                    <Button
                        icon={Strikethrough}
                        title="Toggle strikethrough"
                        onclick={() => console.log("NOT IMPLEMENTED")}
                    />
                {/if}
                {#if button === "link"}
                    <ButtonDialog 
                        icon={Link} 
                        title="Insert link"
                        isActive={editor.isActive('link')}
                        bind:open={url.active}
                        onclick={() => {
                            if (editor.isActive('link')) {
                                editor
                                    .chain()
                                    .focus()
                                    .extendMarkRange('link')
                                    .run();
                            }

                            const { view, state } = editor;
                            const { from, to } = view.state.selection
                            const { href } = editor.getAttributes('link');

                            url.text = state.doc.textBetween(from, to, '');
                            
                            if (href) {
                                url.link = href;
                            }
                        }}
                    >
                        <div class="mb-4">
                            <Input
                                bind:value={url.text}
                                type="text"
                                label="Text"
                                placeholder="Enter text"
                                required
                            />
                        </div>
                        <div class="mb-4">
                            <Input 
                                bind:value={url.link}
                                type="url"
                                label="Link"
                                placeholder="https://example.com"
                                required
                            />
                        </div>
                        <div class="mb-4 flex justify-stretch gap-2">
                            <button 
                                type="button"
                                class={classNames(
                                    'p-2 px-6 w-full',
                                    'rounded-3xl', 
                                    'bg-slate-200'
                                )}
                                onclick={() => {
                                    editor.chain().focus().run();
                                    
                                    url.active = false;
                                    url.link = '';
                                    url.text = '';
                                }}
                            >Cancel</button>
                            <button 
                                type="button"
                                class={classNames(
                                    'p-2 px-6 w-full',
                                    'text-white rounded-3xl', 
                                    'bg-blue-500'
                                )}
                                onclick={() => {
                                    editor.chain()
                                        .insertContent(url.text, { updateSelection: true })
                                        .focus()
                                        .run();

                                    editor
                                        .chain()
                                        .focus()
                                        .setTextSelection({ from: editor.state.selection.$anchor.pos - url.text.length, to: editor.state.selection.$anchor.pos })
                                        .extendMarkRange('link')
                                        .setLink({ href: url.link })
                                        .setTextSelection(editor.state.selection.to + 1)
                                        .run();

                                    //editor.chain().focus('end').run()

                                    url.active = false;
                                    url.link = '';
                                    url.text = '';
                                }}
                            >Insert</button>
                        </div>
                    </ButtonDialog>
                {/if}
                {#if button === "image"}
                    <ButtonDropdown icon={ImagePlus} title="Insert image">
                        <DropdownItem>
                            asdads
                        </DropdownItem>
                    </ButtonDropdown>
                {/if}
            {/each}
        </div>
        {#if groups.length - 1 !== i}
            <span class="bg-gray-300 h-3 w-[1px] mx-2"></span>
        {/if}
    {/each}
</div>
