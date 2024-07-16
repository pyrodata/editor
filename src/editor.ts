import { EditorOptions, mergeDeep } from '@tiptap/core'
import { PdEditor } from "./components/pd-editor";
import { PdButton } from './components/pd-button';
import { PdEditorToolbar } from './components/pd-editor-toolbar';
import { PdModal } from './components/pd-modal';
import { PdDropdown } from './components/pd-dropdown';
import { createObserver, generateElementName, registerElement } from './utils';
import { defaultConfig, EditorClasses } from './config';

export type ToolbarButtonsConfigNamed = { [key: string]: typeof PdButton[] }

export type EditorConfig = {
    tiptap: Partial<EditorOptions>
    toolbar: {
        buttons: ToolbarButtonsConfigNamed
    }
    classes: Partial<EditorClasses>
}

/**
 * Create a new editor instance
 * 
 * @param element   - Element which will be replaced with the editor
 * @param options
 * @returns {PdEditor}
 */
export const createEditor = (element: HTMLElement, options?: Partial<EditorConfig>) => {
    if (options?.toolbar?.buttons) {
        defaultConfig.toolbar.buttons = {}
    }

    const config = mergeDeep(defaultConfig, options || {})
    
    /**
     * Register custom elements before constructing the editor
     */
    const customElements = [
        PdEditor,
        PdEditor,
        PdButton,
        PdEditorToolbar,
        PdModal,
        PdDropdown,
    ]
    customElements.forEach(registerElement)
    /**
     * Create the observer
     */
    createObserver()

    return new PdEditor(element, config as EditorConfig)
}

export const getDropdown = () => document.querySelector(generateElementName(PdDropdown.name)) as PdDropdown
    ?? document.body.appendChild(new PdDropdown) as PdDropdown

export const getModal = () => document.querySelector(generateElementName(PdModal.name)) as PdModal
    ?? document.body.appendChild(new PdModal) as PdModal