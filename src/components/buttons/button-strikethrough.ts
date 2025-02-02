import { PdButton } from "../pd-button";

export class PdButtonStrike extends PdButton {
    static name = 'pd-button-strike'
    
    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>';
    }

    getTitle() {
        return 'Strikethrough'
    }

    onClick(): void {
        this.editor.tiptap.chain().focus().toggleStrike().run()
    }

    isActive() {
        return this.editor.tiptap.isActive('strike')
    }
}