import { classNames } from "@/utils";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { PyrodataEditorToolbar } from "./pd-editor-toolbar";

export class PyrodataEditor extends HTMLElement {
    static observedAttributes = ['toolbar'];

    editor: Editor;

    constructor() {
        super();

        const config = {
            element: this,
            extensions: [
                StarterKit
            ],
            content: '<p>Hello World!</p>',
        }

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

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'toolbar') {
            this.prepend(new PyrodataEditorToolbar(this.editor));
        }
    }
    // Element functionality written in here
}

customElements.define('pd-editor', PyrodataEditor);