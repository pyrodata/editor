<script>
    import { Editor } from "$lib/index.svelte";

</script>
<div class="container my-5">
    <h1 class="text-2xl font-bold mb-5">@pyrodata/editor</h1>
    <div class="prose max-w-none">
        <Editor buttons="heading|bold,italic,strikethrough|link,image" />
    </div>
</div>