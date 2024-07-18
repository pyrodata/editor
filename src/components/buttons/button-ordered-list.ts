import { PdButton } from "../pd-button";

export class PdButtonOrderedList extends PdButton {
    static name = 'pd-button-ordered-list'
    
    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-ordered"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>';
    }

    getTitle() {
        return 'Ordered list'
    }

    onClick(): void {
        this.editor.tiptap.chain().focus().toggleOrderedList().run()
    }

    isActive() {
        return this.editor.tiptap.isActive('orderedList')
    }
}