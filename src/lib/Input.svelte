<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { classNames } from "./index.svelte.js";

    type Props = {
        value?: string;
        label: string;
    } & HTMLInputAttributes;

    let {
        label,
        value = $bindable(''),
        ...rest
    }: Props = $props();
</script>
<div class="relative">
    <input
        bind:value
        class={classNames(
            'px-8 pt-6 pb-2',
            'w-full peer',
            'rounded-full',
            'outline-none',
            'border border-gray-100',
            'focus:border-black',
            'valid:border-success-600',
            'invalid:border-danger-600',
            'placeholder:text-gray-200'
        )}
        {...rest}
    />
    <span
        class={classNames(
            'absolute',
            'left-8 top-1/2 -translate-y-1/2',
            'transition-all',
            'peer-focus:top-5 peer-focus:text-sm peer-focus:text-gray-300',
            'peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-300',
            'peer-valid:top-5 peer-valid:text-sm peer-valid:text-gray-300',
            'peer-invalid:top-5 peer-invalid:text-sm peer-invalid:text-gray-300',
        )}
    >
        {label}
        {#if rest.required}
            <span class="text-danger-600">*</span>
        {/if}
    </span>
</div>