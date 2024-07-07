import { PdButton } from "../pd-button";

export class PdButtonBold extends PdButton {
    public icon() {
        return '<i data-lucide="bold"></i>';
    }

    public onClick(): void {
        this.editor.chain().focus().toggleBold().run()
    }

    public isActive() {
        return this.editor.isActive('bold');
    }
}

customElements.define('pd-button-bold', PdButtonBold);