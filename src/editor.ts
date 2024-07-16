import { EditorOptions, mergeDeep, Editor as TipTap } from '@tiptap/core'
import { PdEditor } from "./components/pd-editor";
import { PdButton } from './components/pd-button';
import { PdEditorToolbar } from './components/pd-editor-toolbar';
import { PdModal } from './components/pd-modal';
import { PdDropdown } from './components/pd-dropdown';
import { createLowlight, common } from 'lowlight'
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
import { type EditorClasses, classes } from './styling';
import { PdButtonCode } from './components/buttons/button-code';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { PdButtonCodeBlock } from './components/buttons/button-code-block';

export type ToolbarButtonsConfigNamed = { [key: string]: typeof PdButton[] }

export type EditorConfig = {
    tiptap: Partial<EditorOptions>
    editor: {
        codeHighlighting: boolean
    }
    toolbar: {
        buttons: ToolbarButtonsConfigNamed
    }
    classes: EditorClasses
}

export const lowlight = createLowlight(common)

export const defaultConfig: EditorConfig = {
    toolbar: {
        buttons: {
            heading: [
                PdButtonHeading
            ],
            format: [
                PdButtonBold,
                PdButtonItalic,
                PdButtonUnderline,
                PdButtonStrike,
                PdButtonCode
            ],
            lists: [
                PdButtonOrderedList,
                PdButtonBulletList
            ],
            table: [
                PdButtonTable
            ],
            blocks: [
                PdButtonLink,
                PdButtonImage,
                PdButtonCodeBlock,
            ]
        }
    },
    editor: {
        codeHighlighting: true
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
                },
                codeBlock: false
            }),
            Link.configure({
                openOnClick: false
            }),
            CodeBlockLowlight.configure({
                lowlight,
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
    },
    classes
}

/**
 * Create a new editor instance
 * 
 * @param element   - Element which will be replaced with the editor
 * @param config
 * @returns {PdEditor}
 */
export const createEditor = (element: HTMLElement, config: Partial<EditorConfig> = defaultConfig) => {
    if (config.toolbar?.buttons) {
        defaultConfig.toolbar.buttons = {}
    }

    config = mergeDeep(defaultConfig, config)

    console.log(config)
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

    tiptap.view.dom.setAttribute("spellcheck", "false")
    tiptap.view.dom.setAttribute("autocomplete", "false")
    tiptap.view.dom.setAttribute("autocapitalize", "false")

    for (const name in config.toolbar!.buttons) {
        // @ts-ignore
        toolbar.registerGroup(name, editor, config.toolbar.buttons[name])
    }

    console.log(document.adoptedStyleSheets)

    return editor
}

export const getDropdown = () => document.querySelector(generateElementName(PdDropdown.name)) as PdDropdown
    ?? document.body.appendChild(new PdDropdown) as PdDropdown

export const getModal = () => document.querySelector(generateElementName(PdModal.name)) as PdModal
    ?? document.body.appendChild(new PdModal) as PdModal