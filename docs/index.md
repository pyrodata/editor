<script setup>
import { onMounted, ref } from 'vue'

onMounted( async () => {
    const { createEditor } = await import('../src/')

    const editorEl = document.getElementById('editor')
    const editor = createEditor(editorEl, {
        tiptap: {
            content: `
<h2>Pyodata Editor</h2>

<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

<h2>Header Level 2</h2>

<ol>
    <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
    <li>Aliquam tincidunt mauris eu risus.</li>
</ol>

<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

<h3>Header Level 3</h3>

<ul>
    <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
    <li>Aliquam tincidunt mauris eu risus.</li>
</ul>`
        }
    })
    console.log(editorEl)
})
</script>

# @pyrodata/editor

::: warning
Note that this is still in beta, so expect bugs and breaking changes until we reach v1
:::

This editor is used on the [pyrodata.com](https://pyrodata.com) website to edit posts and pages. 
It is heavily inspired by the editor used on Reddit.

<div id="editor"></div>

## Installation

Install the package with the package manager you are using.

::: code-group

```bash [npm]
npm install @pyrodata/editor
```

```bash [pnpm]
pnpm install @pyrodata/editor
```

```bash [yarn]
yarn add @pyrodata/editor
```

```bash [bun]
bun add @pyrodata/editor
```
:::

## Usage

To create a new *editor*, use the `createEditor` method as shown below:

```ts
import { createEditor } from '@pyrodata/editor'

const element = document.getElementById('editor')
const editor = createEditor(element)
```

This code snippet initializes a new editor with the default [configuration](./interfaces/config). The `createEditor` method takes a DOM element as an argument, which in this case is the element with the ID 'editor'.