import type { Editor } from "@tiptap/core";
import { PyrodataButtonHeading } from "./buttons/button-heading";
import { PyrodataButtonGroup } from "./buttons/group";
import { classNames } from "@/utils";
import { PyrodataButtonBold } from "./buttons/button-bold";

export class PyrodataEditorToolbar extends HTMLElement {    
    supportedButtons = {
        'heading': PyrodataButtonHeading,
        'bold': PyrodataButtonBold
    }

    constructor(protected editor: Editor) {
        super();

        this.setAttribute('class', classNames(
            'flex py-2 px-3 items-center bg-white sticky top-0 z-10 rounded-ss-3xl rounded-se-3xl'
        ));
    }

    connectedCallback() {
        const groups = this.parentElement!.getAttribute('toolbar')!.split('|').map(group => group.split(','));
        
        for(const buttons of groups) {
            const group = new PyrodataButtonGroup;

            for(const button of buttons) {
                if (this.supportedButtons[button as keyof typeof this.supportedButtons]) {
                    group.appendChild(new this.supportedButtons[button as keyof typeof this.supportedButtons](this.editor))
                }
            }

            this.appendChild(group);
        }
    }
}

customElements.define('pd-editor-toolbar', PyrodataEditorToolbar);