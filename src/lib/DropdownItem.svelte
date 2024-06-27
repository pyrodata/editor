<script lang="ts">
    import type { DropdownItemProps } from "./index.svelte";

    let { children }: DropdownItemProps = $props();
</script>
<div class="flex items-start">
    {@render children()}
</div>