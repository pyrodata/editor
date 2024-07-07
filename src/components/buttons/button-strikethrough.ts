import { PdButton } from "../pd-button";

export class PdButtonStrike extends PdButton {
    public icon() {
        return '<i data-lucide="strikethrough"></i>';
    }

    public onClick(): void {
        this.editor.chain().focus().toggleStrike().run()
    }

    public isActive() {
        return this.editor.isActive('strike');
    }
}

customElements.define('pd-button-strike', PdButtonStrike);