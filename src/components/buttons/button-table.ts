import { html } from "lit"
import { PdButton } from "../pd-button"

export class PdButtonTable extends PdButton {
    static name = 'pd-button-table'
    
    protected button!: HTMLButtonElement;

    connectedCallback() {
        super.connectedCallback()
        
        this.editor.tiptap.on('transaction', () => this.showButton())
        this.button = document.createElement('button')

        this.button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`
        this.button.classList.value = 'hidden absolute p-2 rounded-full hover:bg-slate-200 dark:text-white dark:hover:bg-gray-400'

        this.button.addEventListener('click', () => this.showDropdown())

        document.body.appendChild(this.button)
    }

    disconnectedCallback() {
        this.button.removeEventListener('click', () => this.showDropdown())
        this.editor.tiptap.off('transaction')
    }

    getTitle() {
        return 'Insert table'
    }

    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>';
    }

    onClick(): void {
        this.editor.tiptap.chain().focus().insertTable({ cols: 2, rows: 2 }).run()
    }

    isActive() {
        return this.editor.tiptap.isActive('table');
    }

    showButton() {
        const root = this.getRootNode() as ShadowRoot
        // @ts-ignore
        let selection: Selection | null = root.getSelection()

        if (!selection) {
            selection = window.getSelection()
        }
        
        let reference = selection?.anchorNode?.parentElement;

        reference = reference?.closest('td') 
            ? reference.closest('td')
            : reference?.closest('th')
            ? reference.closest('th')
            : null

        if (!reference) {
            this.button.classList.replace('block', 'hidden')
            return
        }
        
        const { top, left, width } = reference.getBoundingClientRect()
        
        this.button.classList.replace('hidden', 'block')
        
        this.button.style.top = `${(top + window.scrollY) + 3}px`
        this.button.style.left = `${(width + left + window.scrollX) - 38}px`
        
        window.addEventListener('resize', () => {
            const { top, left, width } = reference.getBoundingClientRect()

            this.button.style.top = `${top + 3}px`
            this.button.style.left = `${(width + left) - 38}px`
        } )
    }

    showDropdown() {
        this.editor.dropdown.renderHTML(html`
            <div class="flex flex-col min-w-[250px]">
                <div class="flex flex-col p-2 border-b border-gray-100">
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().toggleHeaderRow().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-toggle-right"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></svg>
                        <span>Toggle header row</span>
                    </button>
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().toggleHeaderCell().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-toggle-right"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></svg>
                        <span>Toggle header column</span>
                    </button>
                </div>
                <div class="flex flex-col p-2 border-b border-gray-100">
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().addRowBefore().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert row above</span>
                    </button>
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().addRowAfter().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert row below</span>
                    </button>
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().deleteRow().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        <span>Delete row</span>
                    </button>
                </div>
                <div class="flex flex-col p-2">
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().addColumnBefore().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert column before</span>
                    </button>
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().addColumnAfter().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert column after</span>
                    </button>
                    <button 
                        class=${this.editor.config.classes.dropdown!.item}
                        @click=${() => {
                            this.editor.tiptap.chain().focus().deleteRow().run()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        <span>Delete column</span>
                    </button>
                </div>
            </div>
        `)

        this.editor.dropdown.show(this.button)
    }
}