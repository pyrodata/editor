<script lang="ts">
    import type { ButtonProps } from "./index.svelte";

    const { icon, onclick, title }: ButtonProps = $props();
</script>
<button {onclick} {title} class="
    p-2 rounded-full
    hover:bg-slate-200
">
    <svelte:component this={icon} size="18" strokeWidth="1" />
</button>