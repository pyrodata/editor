import type { PdDropdown } from "./pd-dropdown";
import type { PdModal } from "./pd-modal";
import { Editor } from "@tiptap/core";
import { EditorConfig, getDropdown, getModal } from "../editor";
import { PdEditorToolbar } from "./pd-editor-toolbar";

export class PdEditor extends HTMLElement {
    readonly config: EditorConfig
    /** 
     * The Tiptap editor instance used for text editing.
     * 
     * @readonly {Editor}
     */
    readonly tiptap: Editor
    /** 
     * The toolbar component for text formatting options.
     * 
     * @readonly {PdEditorToolbar} 
     */
    readonly toolbar: PdEditorToolbar
    /**
     * Reference to dropdown element
     */
    readonly dropdown: PdDropdown
    /**
     * Reference to modal element
     */
    readonly modal: PdModal

    constructor(element: HTMLElement, config: EditorConfig) { 
        super()

        this.config = config
        this.tiptap = new Editor({ ...config.tiptap, element: this })
        this.toolbar = new PdEditorToolbar(this)

        this.dropdown = getDropdown()
        this.modal = getModal()
        
        element.replaceWith(this)
    }

    connectedCallback() {
        this.prepend(this.toolbar)
        this.setAttribute('class', this.config.classes.editor)

        this.tiptap.view.dom.setAttribute("spellcheck", "false")
        this.tiptap.view.dom.setAttribute("autocomplete", "false")
        this.tiptap.view.dom.setAttribute("autocapitalize", "false")
    }
}