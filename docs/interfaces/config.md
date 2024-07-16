# EditorConfig

Below you can find the `EditorConfig`, which is passed as the second argument in the `createEditor` method.

```ts
interface EditorConfig {
    /**
     * TipTap configuration object
     * 
     * Visit TipTap docs for more info
     * 
     * {@link https://tiptap.dev/docs/editor/api/editor}
     */
    tiptap: Partial<EditorOptions>
    /**
     * Options to finetine the toolbar appearnace
     */
    toolbar: {
        /**
         * Named groups with buttons
         */
        buttons: { [key: string]: typeof PdButton[] }
    }
}
```

::: details Example configuration
```ts
const config: EditorConfig = {
    toolbar: {
        buttons: {
            heading: [
                PdButtonHeading
            ],
            format: [
                PdButtonBold,
                PdButtonItalic,
                PdButtonUnderline,
                PdButtonStrike
            ]
        }
    },
    tiptap: {
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false
            }),
            Table.configure({
                resizable: true,
                handleWidth: 10,
                lastColumnResizable: true
            }),
            TableHeader,
            TableRow,
            TableCell,
            Underline,
            Image
        ]
    }
}

createEditor(element, config)
```
:::