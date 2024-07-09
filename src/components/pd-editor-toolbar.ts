import { PdButtonHeading } from "./buttons/button-heading";
import { PdButtonBold } from "./buttons/button-bold";
import { PdButtonItalic } from "./buttons/button-italic";
import { PdButtonStrike } from "./buttons/button-strikethrough";
import { PdButtonLink } from "./buttons/button-link";
import { PdButtonOrderedList } from "./buttons/button-ordered-list";
import { PdButtonBulletList } from "./buttons/button-bullet-list";
import { pdConfig } from "@/config";
import type { PdButton } from "./pd-button";
import { PdButtonTable } from "./buttons/button-table";
import { PdButtonUnderline } from "./buttons/button-underline";

export type ToolbarButtons = {
    'heading': typeof PdButtonHeading
    'bold': typeof PdButtonBold
    'italic': typeof PdButtonItalic
    'underline': typeof PdButtonUnderline
    'strikethrough': typeof PdButtonStrike
    'link': typeof PdButtonLink
    'ordered-list': typeof PdButtonOrderedList
    'bullet-list': typeof PdButtonBulletList
    'table': typeof PdButtonTable
    [key: string]: typeof PdButton
}

export class PdEditorToolbar extends HTMLElement {
    buttons: ToolbarButtons = {
        'heading': PdButtonHeading,
        'bold': PdButtonBold,
        'italic': PdButtonItalic,
        'underline': PdButtonUnderline,
        'strikethrough': PdButtonStrike,
        'link': PdButtonLink,
        'ordered-list': PdButtonOrderedList,
        'bullet-list': PdButtonBulletList,
        'table': PdButtonTable,
    }

    connectedCallback() {
        this.setAttribute('class', pdConfig.toolbar.style);
    }

    /**
     * Add a new button implementation
     * 
     * To display the button in the toolbar you have to 
     * update the toolbar attribute on the editor element
     * 
     * @param name      - name of the button
     * @param button    - implementation
     */
    addButton(name: string, button: typeof PdButton) {
        if (this.buttons[name]) {
            console.warn(`A button with this name already exists, \`${name}\`. This can cause unexpected behaviour.`)
        }

        this.buttons[name] = button;
        this.dispatchEvent(new CustomEvent('buttonAdded', { 
            detail: {
                name,
                button
            }
        }))
    }

    /**
     * Removes a registrated button
     * 
     * This will also remove the button from the toolbar
     * since we deleted the implementation
     * 
     * @param name      - name of the button which was used upon registration
     */
    removeButton(name: string) {
        if (!this.buttons[name]) {
            return
        }

        delete this.buttons[name]

        this.dispatchEvent(new CustomEvent('buttonRemoved', { detail: { name } }))
    }
}

customElements.define('pd-editor-toolbar', PdEditorToolbar);