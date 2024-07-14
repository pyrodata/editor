# @pyrodata/editor

> [!WARNING]  
> Note that this is still in beta, so expect bugs and breaking changes until we reach v1

This editor is used on the [pyrodata.com](https://pyrodata.com) website to edit posts and pages. 
It is heavily inspired by the editor used on Reddit.

## Installation

Install the package with the package manager you are using.

```bash [npm]
npm install @pyrodata/editor
```

## Usage

To create a new *editor*, use the `createEditor` method as shown below:

```ts
import { createEditor } from '@pyrodata/editor'

const element = document.getElementById('editor')
const editor = createEditor(element)
```

This code snippet initializes a new editor with the default [configuration](./interfaces/config).

More to follow ...