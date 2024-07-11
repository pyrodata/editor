import { EditorOptions, Editor as TipTap } from '@tiptap/core'
import { PdEditor } from "./components/pd-editor";
import { PdEditorToolbar } from './components/pd-editor-toolbar';
import { PdModal } from './components/pd-modal';
import { PdDropdown } from './components/pd-dropdown';
import { PdButton } from './components/pd-button';
import { PdButtonHeading } from './components/buttons/button-heading';
import { PdButtonBold } from './components/buttons/button-bold';
import { PdButtonItalic } from './components/buttons/button-italic';
import { PdButtonUnderline } from './components/buttons/button-underline';
import { PdButtonStrike } from './components/buttons/button-strikethrough';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { createObserver, registerElement } from './utils';

export type ToolbarButtonsConfigArray = typeof PdButton[][]
export type ToolbarButtonsConfigNamed = { [key: string]: typeof PdButton[] }

export type EditorConfig = {
    tiptap: Partial<EditorOptions>
    toolbar: {
        buttons: ToolbarButtonsConfigArray | ToolbarButtonsConfigNamed
    }
}

export const defaultConfig: EditorConfig = {
    toolbar: {
        buttons: [
            [
                PdButtonHeading
            ],
            [
                PdButtonBold,
                PdButtonItalic,
                PdButtonUnderline,
                PdButtonStrike
            ]
        ]
    },
    tiptap: {
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false
            }),
            Table.configure({
                resizable: true,
                handleWidth: 10,
                lastColumnResizable: true
            }),
            TableHeader,
            TableRow,
            TableCell,
            Underline,
            Image
        ],
        content: `
            <p>Hello Worlds!</p>
        `
    }
}

/**
 * Create a new editor instance
 * 
 * @param element   - Element which will be replaced with the editor
 * @param config
 * @returns {PdEditor}
 */
export const createEditor = <T extends EditorConfig['toolbar']>(element: HTMLElement, config: EditorConfig = defaultConfig) => {
    /**
     * Register custom elements before constructing the editor
     */
    const customElements = [
        PdEditor, 
        PdButton, 
        PdEditorToolbar, 
        PdModal, 
        PdDropdown
    ]
    customElements.forEach(registerElement)
    /**
     * Create the observer to ensure proper lifecycle hooks are triggered
     */
    createObserver()

    const toolbar = new PdEditorToolbar()
    const editor = new PdEditor(toolbar, getDropdown(), getModal())
    const tiptap = new TipTap({ ...config.tiptap, element: editor })
    
    element.replaceWith(tiptap.options.element)

    editor.prepend(toolbar)
    editor.setEditor(tiptap)

    for (const name in config.toolbar.buttons) {
        // @ts-ignore
        toolbar.registerGroup<T>(name, editor, config.toolbar.buttons[name])
    }
    
    return editor
}

export const getDropdown = () => document.querySelector('pd-dropdown') as PdDropdown
    ?? document.body.appendChild(new PdDropdown) as PdDropdown

export const getModal = () => document.querySelector('pd-modal') as PdModal
    ?? document.body.appendChild(new PdModal) as PdModal

export {
    PdButton,
    PdEditorToolbar
}