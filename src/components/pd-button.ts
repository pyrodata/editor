import { Editor } from "@tiptap/core";
import type { MenuItem, PdDropdown } from "./pd-dropdown";
import { TemplateResult } from "lit-html";
import { PdModal } from "./pd-modal";
import { pdConfig } from "@/config";

export interface PdButton {
    /**
     * Button icon https://lucide.dev/icons/
     */
    getIcon(): string;
    /**
     * Button type, `button`, `dropdown` or `modal`
     *
     * Default `button`
     */
    getType(): 'dropdown' | 'modal' | 'button';
    /**
     * A function that runs each time the editor emits 
     * a transaction to check whether the button should be active
     */
    isActive(): boolean;
    /**
     * A `lit html` to render inside a `modal` or `dropdown`
     */
    getTemplate(): TemplateResult | MenuItem[];
    /**
     * A callback function that runs when clicking the button
     * 
     * `modal` and `dropdown` dont have a `onClick` callback
     */
    onClick(): void;
    /**
     * Called when all attributes are parsed, events are 
     * registered and element is connected to the DOM tree
     */
    onMount(): void;
}

export class PdButton extends HTMLElement implements PdButton {
    /**
     * Button type, `button`, `dropdown` or `modal`
     *
     * Default `button`
     */
    public getType(): 'button' | 'dropdown' | 'modal' {
        return 'button';
    }

    /**
     * Used in the tooltip
     * 
     * In a `modal` also used as header title 
     *
     * @returns 
     */
    public getTitle() {
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
            this.addEventListener('click', () => this[this.getType() as 'modal' | 'dropdown'].toggle(this))
        }
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