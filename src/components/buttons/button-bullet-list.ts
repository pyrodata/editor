import { PdButton } from "../pd-button";

export class PdButtonBulletList extends PdButton {
    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>';
    }

    getTitle() {
        return 'Bullet list'
    }

    onClick(): void {
        this.editor.chain().focus().toggleBulletList().run()
    }

    isActive() {
        return this.editor.isActive('bulletList');
    }
}

customElements.define('pd-button-bullet-list', PdButtonBulletList)