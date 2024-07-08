import { Editor } from "@tiptap/core";
import type { MenuItem, PdDropdown } from "./pd-dropdown";
import { TemplateResult } from "lit-html";
import { PdModal } from "./pd-modal";
import { pdConfig } from "..";

export interface PdButton {
    /**
     * Button type, `button`, `dropdown` or `modal`
     *
     * Default `button`
     */
    getType(): 'dropdown' | 'modal' | 'button';
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
}

export abstract class PdButton extends HTMLElement {
    /**
     * Button icon https://lucide.dev/icons/
     */
    public abstract getIcon(): string;

    /**
     * A function that runs each time the editor emits 
     * a transaction to check whether the button should be active
     */
    public abstract isActive(): boolean;

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

    connectedCallback() {
        this.setAttribute('class', pdConfig.button.style)

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
            /**
             * Set dropdown specific props
             */
            this.addEventListener('click', () =>this.dropdown.toggle(this))
            /**
             * Hide dropdown on pressing escape
             * or when clicking outside the dropdown
             */
            document.addEventListener('keyup', (e) => e.code === 'Escape' && this.dropdown.hide())
        }

        if (this.getType() === 'modal') {
            this.addEventListener('click', () => this.modal.show(this))
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