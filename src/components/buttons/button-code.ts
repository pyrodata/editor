import { PdButton } from "../pd-button";

export class PdButtonCode extends PdButton {
    static name = 'pd-button-code'

    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
    }

    getTitle() {
        return 'Code'
    }

    onClick(): void {
        this.editor.tiptap.chain().focus().toggleCode().run()
    }

    isActive() {
        return this.editor.tiptap.isActive('code');
    }
}