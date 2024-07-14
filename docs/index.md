# @pyrodata/editor

::: warning
Note that this is still in beta, so expect bugs and breaking changes until we reach v1
:::

This editor is used on the [pyrodata.com](https://pyrodata.com) website to edit posts and pages. 
It is heavily inspired by the editor used on Reddit.

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