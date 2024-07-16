# Code highlighting

Code highlighting is enabled by default in the editor, utilizing TipTap's code block lowlight extension. This extension uses the [`lowlight`](https://github.com/wooorm/lowlight?tab=readme-ov-file) library, which is based on [`highlight.js`](https://github.com/highlightjs/highlight.js) for syntax highlighting. However, no CSS for code highlighting is included by default.

To enable code highlighting in your code blocks, you need to include a [`highlight.js`](https://github.com/highlightjs/highlight.js) theme in your project.

For example, to include the GitHub Dark theme from CDNJS, you can add the following link to your HTML:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/github-dark.min.css">
```