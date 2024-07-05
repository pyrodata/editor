<script lang="ts">
    import { onMount } from "svelte";
    import type { ButtonDropdownProps } from "./index.svelte";
    import { ChevronDown } from "lucide-svelte";
    import { computePosition, autoUpdate } from '@floating-ui/dom';

    let { icon, title, children, isActive = $bindable(false) }: ButtonDropdownProps = $props();
    let id = 'id-' + Math.random().toString(36).substr(2, 16);

    //let popper = $state<Popper.Instance>();
    let reference = $state<HTMLButtonElement>();
    let dropdown = $state<HTMLDivElement>();

    function updatePosition() {
        if (!reference || !dropdown) {
            return;
        }

        computePosition(reference, dropdown, {  placement: 'bottom-start' }).then( ( { x, y } ) => {
            Object.assign(dropdown!.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        })
    }

    onMount( () => {
        updatePosition()

        document.addEventListener('click', (e) => {
            if (!dropdown?.contains((e.target as HTMLElement)) && isActive) {
                isActive = false;
            }
        })
    })

    $effect( () => {
        isActive;

        if (!reference || !dropdown) {
            return;
        }
        
        const cleanup = autoUpdate(
            reference,
            dropdown,
            updatePosition,
        );

        return () => cleanup();
    })
</script>
<button
    onclick={() => {
        /**
         * Queue this, so that the `document.addEventListener` 
         * is fired before we excecute this function
         */
        setTimeout(() => {
            isActive = !isActive;
        })
    }}
    bind:this={reference}
    class="
        p-2 rounded-full
        hover:bg-slate-300 hover:bg-opacity-80
        {isActive ? `bg-slate-300 bg-opacity-80` : ''}
    "
    {id}
    {title}
    >
    <div class="flex items-center">
        <svelte:component this={icon} size="18" strokeWidth="1" />
        <ChevronDown size="14" strokeWidth="1" />
    </div>
</button>
<div
    data-show={isActive}
    bind:this={dropdown}
    class="
        w-max absolute top-0 left-0
        bg-white min-w-[150px] border border-gray-300 rounded-2xl shadow-xl overflow-hidden
        hidden popper-show:block
    "
>
    {@render children()}
</div>