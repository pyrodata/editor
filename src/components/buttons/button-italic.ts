import { PdButton } from "../pd-button";

export class PdButtonItalic extends PdButton {
    public icon() {
        return '<i data-lucide="italic"></i>';
    }

    public onClick(): void {
        this.editor.chain().focus().toggleItalic().run()
    }

    public isActive() {
        return this.editor.isActive('italic');
    }
}

customElements.define('pd-button-italic', PdButtonItalic);