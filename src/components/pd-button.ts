import { Editor } from "@tiptap/core";
import type { MenuItem, PdDropdown } from "./pd-dropdown";
import { TemplateResult } from "lit-html";
import { PdModal } from "./pd-modal";
import { pdConfig } from "@/config";

export class PdButton extends HTMLElement {
    /**
     * Button icon https://lucide.dev/icons/
     */
    getIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-puzzle"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/></svg>'
    }
    /**
     * A function that runs each time the editor emits 
     * a transaction to check whether the button should be active
     */
    isActive() {
        return false
    }
    /**
     * A `lit html` to render inside a `modal` or `dropdown`
     */
    getTemplate(): string | TemplateResult | MenuItem[] {
        return ''
    }
    /**
     * A callback function that runs when clicking the button
     * 
     * `modal` and `dropdown` dont have a `onClick` callback
     */
    onClick() {
        throw Error('Not implemented')
    }
    /**
     * Button type, `button`, `dropdown` or `modal`
     *
     * Default `button`
     */
    getType(): 'button' | 'dropdown' | 'modal' {
        return 'button';
    }

    /**
     * Used in the tooltip
     * 
     * In a `modal` also used as header title 
     *
     * @returns 
     */
    getTitle() {
        return '';
    }

    constructor(
        /**
         * Reference to TipTap editor
         */
        protected editor: Editor,
        /**
         * Reference to dropdown element
         */
        protected dropdown: PdDropdown,
        /**
         * Reference to modal element
         */
        protected modal: PdModal
    ) { super() }
    
    onMount() {
        /**
         * A rerender trigger in the toolbar will duplicate
         * the content of the button, so we empty it first 
         */
        this.replaceChildren()
        
        this.setAttribute('class', pdConfig.button.style)
        this.setAttribute('title', this.getTitle())

        this.insertAdjacentHTML('beforeend', this.getIcon())
        this.editor.on('transaction', () => this.toggleActive())

        if (this.onClick) {
            this.addEventListener('click', this.onClick)
        }
        
        if (this.getType() === 'dropdown') {
            /**
             * Insert chevron down icon to distinguish from a normal button
             */
            this.insertAdjacentHTML('beforeend', `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>`)
        }

        if (this.getType() === 'modal' || this.getType() === 'dropdown') {
            this.addEventListener('click', this.toggleCallback)
        }
    }

    toggleCallback() {
        this[this.getType() as 'modal' | 'dropdown'].show(this)
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.onClick)
        this.removeEventListener('click', this.toggleCallback)
    }

    setActive() {
        this.classList.add('bg-gray-50')
    }

    setInactive() {
        this.classList.remove('bg-gray-50')
    }

    toggleActive() {
        if (this.isActive()) {
            return this.setActive()
        }

        return this.setInactive()
    }
}