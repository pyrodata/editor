<script lang="ts">
    import type { ButtonDialogProps } from "./index.svelte";
    import { ChevronDown } from "lucide-svelte";

    let { 
        icon, 
        title, 
        children,
        onclick,
        isActive = $bindable(false),
        open = $bindable(false)
    }: ButtonDialogProps = $props();
    let id = 'id-' + Math.random().toString(36).substr(2, 16);

    //let popper = $state<Popper.Instance>();
    let reference = $state<HTMLButtonElement>();
    let dialog = $state<HTMLDialogElement>();

    $effect( () => {
        if (!dialog) {
            return;
        }

        if (open) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    })
</script>
<button
    onclick={() => {
        onclick();
        /**
         * Queue this, so that the `document.addEventListener` 
         * is fired before we excecute this function
         */
        setTimeout(() => {
            open = !open;
        })
    }}
    bind:this={reference}
    class="
        p-2 rounded-full
        hover:bg-slate-200
        {isActive ? `bg-slate-200` : ''}
    "
    {id}
    {title}
    >
    <div class="flex items-center">
        <svelte:component this={icon} size="18" strokeWidth="1" />
        <ChevronDown size="14" strokeWidth="1" />
    </div>
</button>
<dialog
    bind:this={dialog}
    class="
        w-full sm:w-1/2 md:w-[450px]
        rounded-2xl shadow-lg shadow-gray-50
    "
>
    {#if title}
        <div 
            class="
                px-6 py-4 text-xl font-bold
            "
        >
            {title}
        </div>
    {/if}
    <div
        class="
            px-6 py-4
        "
    >
        {@render children()}
    </div>
</dialog>