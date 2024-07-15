import { Editor } from "@tiptap/core";
import { PdEditorToolbar } from "./pd-editor-toolbar";
import { PdDropdown } from "./pd-dropdown";
import { PdModal } from "./pd-modal";
import { classes } from "../styling";

export class PdEditor extends HTMLElement {
    /**
     * Reference to TipTap editor
     * 
     * @type {Editor}
     */
    protected editor!: Editor

    constructor(
        /**
         * Reference to PdEditorToolbar
         * 
         * @type {PdEditorToolbar}
         */
        readonly toolbar: PdEditorToolbar,
        /**
         * Reference to PdDropdown
         * 
         * @type {PdDropdown}
         */
        readonly dropdown: PdDropdown,
        /**
         * Reference to PdModal
         * 
         * @type {PdModal}
         */
        readonly modal: PdModal,
    ) { super() }

    connectedCallback() {
        this.setAttribute('class', classes.editor)
    }

    setEditor(editor: Editor) {
        this.editor = editor;
    }

    getEditor() {
        return this.editor;
    }
}