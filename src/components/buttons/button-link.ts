import { html } from "lit";
import { PdButton } from "../pd-button";
import { classNames } from "../../utils";
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import type { PdEditor } from "../pd-editor";

export class PdButtonLink extends PdButton {
    static name = 'pd-button-link'
    
    formRef: Ref<HTMLFormElement> = createRef()

    constructor(editor: PdEditor) { 
        super(editor)

        this.editor.modal.addEventListener('hide', () => this.formRef.value?.reset())
        this.editor.tiptap.on('transaction', () => this.showDropdown())
    }
    
    getType() {
        return 'modal' as const
    }

    getIcon(): string {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    }

    getTitle() {
        return 'Insert link'
    }

    isActive() {
        return this.editor.tiptap.isActive('link')
    }

    setLink(e: SubmitEvent) {
        e.preventDefault()
        
        const formData = new FormData((e.target as HTMLFormElement))
        const text = formData.get('text') as string
        const url = formData.get('url') as string

        this.editor.tiptap.chain()
            .focus()
            .setLink({ href: url })
            .insertContent(text.trim())
            .focus()
            .run()
        
        this.editor.modal.hide()
    }

    unsetLink() {
        this.editor.tiptap
            .chain()
            .focus()
            .unsetLink()
            .run()
    }
    
    getTemplate() {
        return html`
            <form @submit=${(e: SubmitEvent) => this.setLink(e)} ${ref(this.formRef)}>
                <div class="mb-3">
                    <div class="relative">
                        <input 
                            type="text"
                            name="text"
                            class=${classNames(
                                'pt-6 pb-2 px-6 peer',
                                'w-full rounded-full',
                                'border border-gray-100',
                                'outline-none',
                                'dark:bg-gray-500 dark:border-gray-400'
                            )}
                            value=${this.textValue}
                            required
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
                        >Text <span class="text-red-500">*</span></label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="relative">
                        <input 
                            type="text"
                            name="url"
                            class=${classNames(
                                'pt-6 pb-2 px-6 peer',
                                'w-full rounded-full',
                                'border border-gray-100',
                                'outline-none',
                                'dark:bg-gray-500 dark:border-gray-400'
                            )}
                            value=${this.urlValue}
                            required
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
                        >URL <span class="text-red-500">*</span></label>
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
                        @click=${() => this.editor.modal.hide()}
                    >Cancel</button>
                    <button 
                        type="submit"
                        class=${classNames(
                            'px-6 py-2',
                            'w-full rounded-full',
                            'bg-blue-500 text-white',
                        )}
                    >Insert</button>
                </div>
            </form>
        `
    }

    showDropdown() {
        const root = this.getRootNode() as ShadowRoot
        // @ts-ignore
        let selection: Selection | null = root.getSelection()

        if (!selection) {
            selection = window.getSelection()
        }
        
        const reference = selection?.anchorNode?.parentElement;
        
        if (!reference) {
            return this.editor.dropdown.hide()
        }

        if (reference.closest('a')?.tagName !== 'A') {
            return this.editor.dropdown.hide()
        }
        
        this.editor.dropdown.renderHTML(html`
            <div class="px-4 py-1 flex items-center">
                <a 
                    href=${this.urlValue} 
                    target="_blank" 
                    class=${classNames(
                        'me-3',
                        'max-w-[300px] overflow-hidden',
                        'text-ellipsis text-nowrap',
                        'text-sm font-medium',
                        'text-blue-500 visited:text-purple-500'
                    )}
                >${this.urlValue}</a>
                <button class="p-2 rounded-full hover:bg-slate-200" @click=${() => this.unsetLink()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unlink"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/></svg>
                </button>
                <button class="p-2 rounded-full hover:bg-slate-200" @click=${() => this.editor.modal.show(this)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                </button>
            </div>
        `)
        this.editor.dropdown.show(reference)
    }

    get textValue() {
        if (this.isActive()) {
            this.editor.tiptap
                .chain()
                .focus()
                .extendMarkRange('link')
                .run()
        }

        const { view, state } = this.editor.tiptap
        const { from, to } = view.state.selection

        return state.doc.textBetween(from, to, '')
    }

    get urlValue() {
        if (!this.isActive()) {
            return '';
        }

        return this.editor.tiptap.getAttributes('link').href;
    }
}