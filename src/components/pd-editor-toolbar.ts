import type { Editor } from "@tiptap/core";
import type { PdModal } from "./pd-modal";
import type { PdDropdown } from "./pd-dropdown";

import { PdButtonHeading } from "./buttons/button-heading";
import { PyrodataButtonGroup } from "./buttons/group";
import { classNames } from "@/utils";
import { PdButtonBold } from "./buttons/button-bold";
import { PdButtonItalic } from "./buttons/button-italic";
import { PdButtonStrike } from "./buttons/button-strikethrough";
import { PdButtonLink } from "./buttons/button-link";

export class PyrodataEditorToolbar extends HTMLElement {    
    supportedButtons = {
        'heading': PdButtonHeading,
        'bold': PdButtonBold,
        'italic': PdButtonItalic,
        'strikethrough': PdButtonStrike,
        'link': PdButtonLink
    }

    constructor(
        /**
         * A reference to the TipTap editor
         */
        protected editor: Editor,
        /**
         * Reference to dropdown element
         */
        protected dropdown: PdDropdown,
        /**
         * Reference to modal element
         */
        protected modal: PdModal,
    ) {
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
                    group.appendChild(new this.supportedButtons[button as keyof typeof this.supportedButtons](this.editor, this.dropdown, this.modal))
                }
            }

            this.appendChild(group);
        }
    }
}

customElements.define('pd-editor-toolbar', PyrodataEditorToolbar);