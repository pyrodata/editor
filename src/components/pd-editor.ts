import { classNames } from "@/utils";
import { Editor, type EditorOptions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { PyrodataEditorToolbar } from "./pd-editor-toolbar";
import { PdDropdown } from "./pd-dropdown";
import { PdModal } from "./pd-modal";
import Link from "@tiptap/extension-link";

export class PyrodataEditor extends HTMLElement {
    static observedAttributes = ['toolbar'];

    editor: Editor;

    constructor() {
        super();

        const config = {
            element: this,
            extensions: [
                StarterKit,
                Link.configure({
                    openOnClick: false
                })
            ],
            content: '<p>Hello World!</p>' 
        } satisfies Partial<EditorOptions>

        /**
         * Initialize TipTap editor
         */
        this.editor = new Editor(config);
        this.setAttribute('class', classNames(
            'block',
            'border border-gray-100 rounded-3xl *:outline-none',
            'has-[.ProseMirror-focused]:border-black asd',
            '[&>.ProseMirror]:px-4 [&>.ProseMirror]:py-4'
        ));
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

customElements.define('pd-editor', PyrodataEditor);