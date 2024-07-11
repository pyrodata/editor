# Create a custom button

Creating a custom button is easy, in this guide we will explain how you can create a custom button and add it to the toolbar.

In this guide we will create a button that allows us to insert an image.

## Basis

Since `@pyrodata/editor` is using [TipTap](https://tiptap.dev/) under the hood we can use the [`@tiptap/extension-image`](https://tiptap.dev/docs/editor/extensions/nodes/image)

You can access the `TipTap` instance within a *custom button* by referencing `this.editor`

Lets install and register the `@tiptap/extension-image`

```bash
pnpm add @tiptap/extension-image
```

Update your *TipTap*  `config` to include the new exension.

```ts
import Image from '@tiptap/extension-image'

const config: EditorConfig = {
    // ...
    tiptap: {
        // ...
        extensions: [
            // ... rest of the extensions
            Image
        ]
    }
}
```

Now register the extension in the *editor*

Next we have to create our implementation, to do this we have to create a `class` that extends `PdButton`

::: tip
We recommend you to name your class as following, start with `PdButton` followed with the type of the **button**.
Eg. `PdButtonImage`, `PdButtonOrderedList`

The custom element that gets registered is *kebab-cased*.

Eg. `PdButtonImage` will become `<pd-button-image>`
:::

```ts
import { PdButton } from '@pyrodata/editor'

export class PdButtonImage extends PdButton {
    /**
     * Which type of button we are creating?     
     * It can be one of 'button', 'dropdown' or 'modal'. Default is button
     * 
     * @optional
     * @default button
     */
    getType() {
        return 'modal' as const
    }

    /**
     * Should be an SVG. 
     * 
     * If you use font icons, that works too (<i class="fa fa-image"></i>)
     * 
     * All icons used by the editor are from https://lucide.dev/icons/    
     * with a stroke width of 1px and the size being 18px
     * 
     * @required
     */
    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-plus"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
    }

    /**
     * The title is used as a tooltip when hovering the button
     * 
     * Beside being used as tooltip, its also used as header title in a modal
     * 
     * @required
     */
    getTitle() {
        return 'Insert image'
    }

    /**
     * A function that that checks when the button should be in an 'active' state    
     * Since we use TipTap under the hood, we can use TipTaps `.isActive()` method
     * 
     * @required
     */
    isActive() {
        return this.editor.isActive('image')
    }
}
```

Now add the button to the *editor* instance.

```ts
// Lets create a new group at the end of the 
// toolbar to append our new button to
editor.toolbar.registerGroup('others', editor)
// Add the button to the newly created group
editor.toolbar.addButton('others', PdButtonImage, editor)
```

This is the foundation of our custom button. If everything is set up correctly, 
you should now see the newly created button. When you click the button, 
an empty modal will pop up, as we haven't implemented the template yet.

## Create the modal template

We recommend using [`lit-html`](https://lit.dev/docs/v1/lit-html/introduction/) for templating
since this makes everything much easier. In this example we will use `lit-html` to create the 
template.

```ts
import { html } from 'lit';
import { Ref, createRef, ref } from 'lit/directives/ref.js';

const classNames = (...classNames: string[]) => classNames.join(' ');

export class PdButtonImage extends PdButton {

    // ... everything that we implemented earlier // [!code highlight]
    
    /**
     * A reference to the HTMLFormElement
     * 
     * @link https://lit.dev/docs/api/directives/#createRef
     */
    private formRef: Ref<HTMLFormElement> = createRef()

    /**
     * The callback we call when we submit the form in the modal
     */
    setImage(e: SubmitEvent) {
        e.preventDefault()

        const formData = new FormData((e.target as HTMLFormElement))
        const src = formData.get('src') as string

        this.editor.chain().focus().setImage({ src }).run()
        this.modal.hide()

        // Reset the form after  submit
        this.formRef.value?.reset()
    }

    /**
     * The returned string of this method will be rendered as body
     * of the modal
     */
    getTemplate() {
        return html` 
            <form 
                @submit=${(e: SubmitEvent) => this.setImage(e)} 
                ${ref(this.formRef)}
            >
                <div class="mb-3">
                    <div class="relative">
                        <input 
                            type="text"
                            name="src"
                            class=${classNames(
                                'pt-6 pb-2 px-6 peer',
                                'w-full rounded-full',
                                'border border-gray-100',
                                'outline-none'
                            )}
                            required
                            value=${this.valueSrc}
                        />
                        <label
                            class=${classNames(
                                'absolute top-1/2 left-6',
                                '-translate-y-1/2',
                                'text-slate-700',
                                'transition-all',
                                'peer-focus:top-4 peer-focus:text-xs',
                                'peer-valid:top-4 peer-valid:text-xs',
                                'peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs'
                            )}
                        >Image URL <span class="text-red-500">*</span></label>
                    </div>
                </div>
                <div class="mb-3 flex justify-stretch gap-3">
                    <button 
                        type="button"
                        class=${classNames(
                            'px-6 py-2',
                            'w-full rounded-full',
                            'bg-slate-200'
                        )}
                        @click=${() => this.modal.hide()}
                    >Cancel</button>
                    <button 
                        type="submit"
                        class=${classNames(
                            'px-6 py-2',
                            'w-full rounded-full',
                            'bg-blue-500 text-white'
                        )}
                    >Insert</button>
                </div>
            </form>
        `
    }

    /**
     * We can get the src attribute of an inserted image using this code
     * 
     * @link https://tiptap.dev/docs/editor/api/editor#getattributes
     */
    get valueSrc() {
        if (!this.isActive()) {
            return '';
        }

        return this.editor.getAttributes('image').src;
    }
}
```

## Finished

Congratulations, you have now succesfully implemented a working custom button.

The full code should look like this
::: details Click me to view the code
```ts
import { html } from 'lit';
import { Ref, createRef, ref } from 'lit/directives/ref.js';

const classNames = (...classNames: string[]) => classNames.join(' ');

export class PdButtonImage extends PdButton {
    /**
     * A reference to the HTMLFormElement
     * 
     * @link https://lit.dev/docs/api/directives/#createRef
     */
    private formRef: Ref<HTMLFormElement> = createRef()
    /**
     * Which type of button we are creating?     
     * It can be one of 'button', 'dropdown' or 'modal'. Default is button
     * 
     * @optional
     * @default button
     */
    getType() {
        return 'modal' as const
    }

    /**
     * Should be an SVG. 
     * 
     * If you use font icons, that works too (<i class="fa fa-image"></i>)
     * 
     * All icons used by the editor are from https://lucide.dev/icons/    
     * with a stroke width of 1px and the size being 18px
     * 
     * @required
     */
    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-plus"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
    }

    /**
     * The title is used as a tooltip when hovering the button
     * 
     * Beside being used as tooltip, its also used as header title in a modal
     * 
     * @required
     */
    getTitle() {
        return 'Insert image'
    }

    /**
     * A function that that checks when the button should be in an 'active' state    
     * Since we use TipTap under the hood, we can use TipTaps `.isActive()` method
     * 
     * @required
     */
    isActive() {
        return this.editor.isActive('image')
    }

    /**
     * The callback we call when we submit the form in the modal
     */
    setImage(e: SubmitEvent) {
        e.preventDefault()

        const formData = new FormData((e.target as HTMLFormElement))
        const src = formData.get('src') as string

        this.editor.chain().focus().setImage({ src }).run()
        this.modal.hide()
        this.formRef.value?.reset()
    }

    /**
     * The returned string of this method will be rendered as body
     * of the modal
     */
    getTemplate() {
        return html` 
            <form 
                @submit=${(e: SubmitEvent) => this.setImage(e)} 
                ${ref(this.formRef)}
            >
                <div class="mb-3">
                    <div class="relative">
                        <input 
                            type="text"
                            name="src"
                            class=${classNames(
                                'pt-6 pb-2 px-6 peer',
                                'w-full rounded-full',
                                'border border-gray-100',
                                'outline-none'
                            )}
                            required
                            value=${this.valueSrc}
                        />
                        <label
                            class=${classNames(
                                'absolute top-1/2 left-6',
                                '-translate-y-1/2',
                                'text-slate-700',
                                'transition-all',
                                'peer-focus:top-4 peer-focus:text-xs',
                                'peer-valid:top-4 peer-valid:text-xs',
                                'peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs'
                            )}
                        >Image URL <span class="text-red-500">*</span></label>
                    </div>
                </div>
                <div class="mb-3 flex justify-stretch gap-3">
                    <button 
                        type="button"
                        class=${classNames(
                            'px-6 py-2',
                            'w-full rounded-full',
                            'bg-slate-200'
                        )}
                        @click=${() => this.modal.hide()}
                    >Cancel</button>
                    <button 
                        type="submit"
                        class=${classNames(
                            'px-6 py-2',
                            'w-full rounded-full',
                            'bg-blue-500 text-white'
                        )}
                    >Insert</button>
                </div>
            </form>
        `
    }

    /**
     * We can get the src attribute of an inserted image using this code
     * 
     * @link https://tiptap.dev/docs/editor/api/editor#getattributes
     */
    get valueSrc() {
        if (!this.isActive()) {
            return '';
        }

        return this.editor.getAttributes('image').src;
    }
}
```
:::