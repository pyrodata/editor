import "./style.css";

import { pdConfig } from './config';

import './components/pd-editor';
import './components/pd-editor-toolbar';
import { PdEditor } from "./components/pd-editor";
import { PdButton } from "./components/pd-button";

export {
    pdConfig,
    PdEditor,
    PdButton
}

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.querySelector('pd-editor') as PdEditor

    //editor.toolbar.removeButton('bold')
    editor.editor.chain().focus().insertTable().run()
})