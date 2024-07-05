<script lang="ts">
    import type { DropdownItemProps } from "./index.svelte";

    let { children }: DropdownItemProps = $props();
</script>
<div class="
        flex p-1 items-start
        [&>button]:w-full [&>button]:rounded-xl
    "
>
    {@render children()}
</div>