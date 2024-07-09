import { Editor } from "@tiptap/core";
import { PdEditorToolbar } from "./pd-editor-toolbar";
import { PdDropdown } from "./pd-dropdown";
import { PdModal } from "./pd-modal";
import { pdConfig } from "..";

export class PdEditor extends HTMLElement {
    static observedAttributes = ['toolbar'];

    /**
     * Reference to TipTap editor
     * 
     * @type {Editor}
     */
    editor: Editor;
    /**
     * Reference to PdEditorToolbar
     * 
     * @type {PdEditorToolbar}
     */
    toolbar: PdEditorToolbar;
    /**
     * Reference to PdDropdown
     * 
     * @type {PdDropdown}
     */
    dropdown: PdDropdown;
    /**
     * Reference to PdModal
     * 
     * @type {PdModal}
     */
    modal: PdModal;

    constructor() {
        super();

        /**
         * Initialize TipTap editor
         */
        this.editor = new Editor(Object.assign(pdConfig.editor.config, { element: this }))
        this.setAttribute('class', pdConfig.editor.style)

        this.dropdown = document.querySelector('pd-dropdown') as PdDropdown ?? document.body.appendChild(new PdDropdown) as PdDropdown
        this.modal = document.querySelector('pd-modal') as PdModal ?? document.body.appendChild(new PdModal) as PdModal
        this.toolbar = new PdEditorToolbar()

        this.prepend(this.toolbar)
        this.renderButtons()
        
        this.toolbar.addEventListener('buttonAdded', () => this.renderButtons())
        this.toolbar.addEventListener('buttonRemoved', () => this.renderButtons())
    }

    renderButtons() {
        let toolbar = this.getAttribute('toolbar')

        while (this.toolbar.firstChild) { this.toolbar.removeChild(this.toolbar.firstChild) }

        /**
         * Default set of buttons of none are specified
         */
        if (!toolbar) {
            toolbar = 'heading|bold,italic,strikethrough|link,image|table'
        }

        const groups = toolbar.split('|')
        
        for (const group of groups) {
            const groupDiv = document.createElement('div')
            groupDiv.classList.add('me-1', 'flex')

            group.split(',').forEach(buttonName => {
                if (!this.toolbar.buttons[buttonName]) {
                    return;
                }

                groupDiv.append(
                    new this.toolbar.buttons[buttonName](
                        this.editor, 
                        this.dropdown, 
                        this.modal
                    )
                )
            })

            this.toolbar.append(groupDiv)
        }
    }
}

customElements.define('pd-editor', PdEditor);