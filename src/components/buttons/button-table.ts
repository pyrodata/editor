import { html } from "lit-html";
import { PdButton } from "../pd-button";

export class PdButtonTable extends PdButton {
    protected button!: HTMLButtonElement;

    connectedCallback() {
        this.editor.on('transaction', () => this.showButton())
        this.button = document.createElement('button')

        this.button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`
        this.button.classList.value = 'hidden absolute p-2 rounded-full hover:bg-slate-200'

        this.button.addEventListener('click', () => this.showDropdown())

        document.body.appendChild(this.button)
    }

    getTitle() {
        return 'Insert table'
    }

    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>';
    }

    onClick(): void {
        this.editor.chain().focus().insertTable({ cols: 2, rows: 2 }).run()
    }

    isActive() {
        return this.editor.isActive('table');
    }

    showButton() {
        const reference = document.getSelection()!.anchorNode?.parentElement;
        
        if (!reference) {
            this.button.classList.replace('block', 'hidden')
            return
        }

        if (reference.closest('td')?.tagName !== 'TD') {
            this.button.classList.replace('block', 'hidden')
            return
        }
        
        const rects = reference.getBoundingClientRect();
        
        this.button.classList.replace('hidden', 'block')

        this.button.style.top = `${rects.top + 3}px`
        this.button.style.left = `${(rects.width + rects.left) - 38}px`
    }

    showDropdown() {
        this.dropdown.renderHTML(html`
            <div class="flex flex-col">
                <button class="py-3 px-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span>Insert row above</span>
                </button>
                <button class="py-2 px-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span>Insert row below</span>
                </button>
            </div>
        `)

        this.dropdown.show(this.button)
    }
}

customElements.define('pd-button-table', PdButtonTable);