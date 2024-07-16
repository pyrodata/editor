import { PdButton } from "../pd-button";

export class PdButtonCodeBlock extends PdButton {
    static name = 'pd-button-code-block'

    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-code"><path d="M10 9.5 8 12l2 2.5"/><path d="m14 9.5 2 2.5-2 2.5"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>';
    }

    onClick(): void {
        this.editor.chain().focus().toggleCodeBlock().run()
    }

    isActive() {
        return this.editor.isActive('codeBlock');
    }
}