<script lang="ts">
    import type { ButtonProps } from "./index.svelte";

    const { icon, onclick, title }: ButtonProps = $props();
</script>
<button {onclick} {title} class="
    p-2 rounded-full
    hover:bg-slate-300 hover:bg-opacity-80
">
    <svelte:component this={icon} size="18" strokeWidth="1" />
</button>