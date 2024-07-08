import { Editor } from "@tiptap/core";
import { PyrodataEditorToolbar } from "./pd-editor-toolbar";
import { PdDropdown } from "./pd-dropdown";
import { PdModal } from "./pd-modal";
import { pdConfig } from "..";

export class PdEditor extends HTMLElement {
    static observedAttributes = ['toolbar'];

    editor: Editor;

    constructor() {
        super();

        /**
         * Initialize TipTap editor
         */
        this.editor = new Editor(Object.assign(pdConfig.editor.config, { element: this }))
        this.setAttribute('class', pdConfig.editor.style)
    }

    connectedCallback() {
        const dropdown = document.querySelector('pd-dropdown') as PdDropdown ?? document.body.appendChild(new PdDropdown) as PdDropdown
        const modal = document.querySelector('pd-modal') as PdModal ?? document.body.appendChild(new PdModal) as PdModal

        /**
         * Append the toolbar to the editor
         */
        this.prepend(new PyrodataEditorToolbar(this.editor, dropdown, modal))
    }
}

customElements.define('pd-editor', PdEditor);