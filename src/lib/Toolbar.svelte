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
    import { DropdownItem, type EditorToolbarProps } from "./index.svelte.js";
    import ButtonDropdown from "./ButtonDropdown.svelte";

    const {
        buttons = "heading,bold,italic,strikethrough|link",
        editor,
    }: EditorToolbarProps = $props();

    const groups = buttons.split("|").map((group) => group.split(","));
</script>

<div class="flex py-2 px-3 items-center bg-white border-b-2 border-gray-300 sticky top-0 z-10">
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
                    <ButtonDropdown icon={Link} title="Insert link" isActive={editor.isActive('link')}>
                        <DropdownItem>
                            <div class="flex flex-col items-start py-3 px-4 gap-3">
                                <div class="flex gap-3 min-w-[300px] items-center">
                                    <input 
                                        type="url" 
                                        class="
                                            p-1 px-5 border-2 min-w-[300px] border-gray-300 rounded-3xl *:outline-none
                                          focus:border-black focus:ring-4 focus:ring-gray-300
                                        "
                                        value="https://pyrodata.com/chemicals/charcoal"
                                    />
                                    <button 
                                        type="button"
                                        class="p-1 px-6 text-white border-2 border-primary-500 bg-primary-500 rounded-3xl"
                                    >insert</button>
                                    <button 
                                        type="button"
                                        class="p-1 px-6 text-white border-2 border-primary-200 bg-primary-200 rounded-3xl"
                                    >unlink</button>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" id="open-in-new-tab" />
                                    <label for="open-in-new-tab">Open link in new tab</label>
                                </div>
                            </div>
                        </DropdownItem>
                    </ButtonDropdown>
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
