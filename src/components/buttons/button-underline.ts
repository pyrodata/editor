import { PdButton } from "../pd-button";

export class PdButtonUnderline extends PdButton {
    static name = 'pd-button-underline'
    
    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-underline"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>';
    }

    getTitle() {
        return 'Underline'
    }

    onClick(): void {
        this.editor.tiptap.chain().focus().toggleUnderline().run()
    }

    isActive() {
        return this.editor.tiptap.isActive('underline')
    }
}