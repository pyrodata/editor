import { html } from 'lit';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { PdButton } from "../pd-button";
import { classNames } from '@/utils';

export class PdButtonImage extends PdButton {
    static name = 'pd-button-image'
    
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
        // @ts-ignore
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
                                'outline-none',
                                'dark:bg-gray-500 dark:border-gray-400'
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
                <div class="mb-3 mt-8 flex justify-stretch gap-3">
                    <button 
                        type="button"
                        class=${classNames(
                            'px-6 py-2',
                            'w-full rounded-full',
                            'bg-slate-200',
                            'dark:bg-gray-400'
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