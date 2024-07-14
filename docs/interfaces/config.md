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
         * Array with buttons or an object 
         * with named keys containing array with buttons
         * 
         * Named button groups is recommended to access groups 
         * by name later on to create or remove buttons
         */
        buttons: 
            typeof PdButton[][]
            | { [key: string]: typeof PdButton[] }
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