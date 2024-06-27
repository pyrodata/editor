<script lang="ts">
    import { onMount } from "svelte";
    import type { ButtonDropdownProps } from "./index.svelte";
    import { ChevronDown } from "lucide-svelte";

    let { icon, title, children, isActive = $bindable(false) }: ButtonDropdownProps = $props();
    let id = 'id-' + Math.random().toString(36).substr(2, 16);

    let toggleDropdown = () => {
        isActive = true;
    }

    onMount(() => {
        window.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest(`#${id}`)) {
                isActive = false;
            }
        })
    })
</script>
<button 
    onclick={toggleDropdown} 
    class="
        relative p-2 rounded-full
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
    <div 
        class="
            absolute top-[calc(100%+.25rem)] left-0 bg-white min-w-[150px] border border-gray-300 rounded-2xl z-20 shadow-xl overflow-hidden
        "
        class:hidden={!isActive}
        class:block={isActive}
    >
        {@render children()}
    </div>
</button>