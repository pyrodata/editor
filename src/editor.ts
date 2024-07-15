import { EditorOptions, mergeDeep, Editor as TipTap } from '@tiptap/core'
import { PdEditor } from "./components/pd-editor";
import { PdButton } from './components/pd-button';
import { PdEditorToolbar } from './components/pd-editor-toolbar';
import { PdModal } from './components/pd-modal';
import { PdDropdown } from './components/pd-dropdown';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { createObserver, generateElementName, registerElement } from './utils';
import {
    PdButtonBold,
    PdButtonBulletList, 
    PdButtonHeading, 
    PdButtonImage, 
    PdButtonItalic, 
    PdButtonLink, 
    PdButtonOrderedList, 
    PdButtonStrike,
    PdButtonTable, 
    PdButtonUnderline
} from './components/buttons';

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
            ],
            [
                PdButtonOrderedList,
                PdButtonBulletList
            ],
            [
                PdButtonTable
            ],
            [
                PdButtonLink,
                PdButtonImage
            ]
        ]
    },
    tiptap: {
        extensions: [
            StarterKit.configure({
                bulletList: {
                    itemTypeName: 'listItem',
                    HTMLAttributes: { class: '[&_p]:m-0' }
                },
                orderedList: {
                    HTMLAttributes: { class: '[&_p]:m-0' }
                }
            }),
            Link.configure({
                openOnClick: false
            }),
            Table.configure({
                resizable: false,
                lastColumnResizable: false,
            }),
            TableHeader,
            TableRow,
            TableCell,
            Underline,
            Image
        ]
    }
}

/**
 * Create a new editor instance
 * 
 * @param element   - Element which will be replaced with the editor
 * @param config
 * @returns {PdEditor}
 */
export const createEditor = (element: HTMLElement, config: Partial<EditorConfig> = defaultConfig) => {
    config = mergeDeep(config, defaultConfig)
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
     * Create the observer
     */
    createObserver()

    const toolbar = new PdEditorToolbar()
    const editor = new PdEditor(toolbar, getDropdown(), getModal())
    const tiptap = new TipTap({ ...config.tiptap, element: editor })

    editor.prepend(toolbar)
    editor.setEditor(tiptap)

    element.replaceWith(editor)

    for (const name in config.toolbar!.buttons) {
        // @ts-ignore
        toolbar.registerGroup(name, editor, config.toolbar.buttons[name])
    }

    return editor
}

export const getDropdown = () => document.querySelector(generateElementName(PdDropdown.name)) as PdDropdown
    ?? document.body.appendChild(new PdDropdown) as PdDropdown

export const getModal = () => document.querySelector(generateElementName(PdModal.name)) as PdModal
    ?? document.body.appendChild(new PdModal) as PdModal