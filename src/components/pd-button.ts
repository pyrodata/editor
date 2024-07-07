import { classNames } from "@/utils";
import { Editor } from "@tiptap/core";
import type { MenuItem, PdDropdown } from "./pd-dropdown";
import { TemplateResult, render } from "lit-html";
import { PdModal } from "./pd-modal";

export interface PdButton {
    /**
     * Button type, `button`, `dropdown` or `modal`
     *
     * Default `button`
     */
    type(): 'dropdown' | 'modal' | 'button';
    dropdownTemplate?(): MenuItem[] | TemplateResult;
    /**
     * A `lit html` to render inside a `modal` or `dropdown`
     */
    template?(): TemplateResult | MenuItem[];
    /**
     * A callback function that runs when clicking the button
     * 
     * `modal` and `dropdown` dont have a `onClick` callback
     */
    onClick?(): void;
}

export abstract class PdButton extends HTMLElement {
    static observedAttributes = ['active', 'aria-expanded'];

    /**
     * Button icon https://lucide.dev/icons/
     */
    public abstract icon(): string;

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
    public type(): 'button' | 'dropdown' | 'modal' {
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
        this.setAttribute('class', classNames(
            'rounded-full p-2',
            'flex justify-center items-center',
            'hover:bg-gray-50',
            'cursor-pointer',
        ))

        this.insertAdjacentHTML('beforeend', this.icon())
        this.editor.on('transaction', () => this.toggleActive())

        if (this.onClick) {
            this.addEventListener('click', this.onClick)
        }


        if (this.type() === 'dropdown') {
            /**
             * Insert chevron down icon to distinguish from a normal button
             */
            this.insertAdjacentHTML('beforeend', `<i data-lucide="chevron-down"></i>`)
            /**
             * Set dropdown specific props
             */
            this.dropdown = document.querySelector('pd-dropdown') as PdDropdown
            this.addEventListener('click', () => {
                if (Array.isArray(this.dropdownTemplate!())) {
                    this.dropdown.renderMenu(this.dropdownTemplate!() as MenuItem[])
                }

                this.dropdown.toggle(this)
            })
            /**
             * Hide dropdown on pressing escape
             * or when clicking outside the dropdown
             */
            document.addEventListener('keyup', (e) => e.code === 'Escape' && this.dropdown.hide())
        }

        if (this.type() === 'modal') {
            this.addEventListener('click', this.openModal.bind(this))
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

    openModal() {
        this.modal.render(this.template!() as TemplateResult, this.getTitle())
        this.modal.show()
    }
}