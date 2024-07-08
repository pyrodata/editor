import { PdButton } from "../pd-button";

export class PdButtonItalic extends PdButton {
    public getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>';
    }

    public onClick(): void {
        this.editor.chain().focus().toggleItalic().run()
    }

    public isActive() {
        return this.editor.isActive('italic');
    }
}

customElements.define('pd-button-italic', PdButtonItalic);