import { autoUpdate, computePosition, type Placement } from '@floating-ui/dom';
import { html, render, type TemplateResult } from 'lit';
import { PdButton } from './pd-button';
import { styling } from '@/config';

export type MenuItem = {
    title: string;
    icon: TemplateResult;
    action: (e: PointerEvent, dropdown: PdDropdown) => void;
}

export class PdDropdown extends HTMLElement {
    #reference?: HTMLElement | PdButton

    #placement: Placement = 'bottom-start'

    #updater?: () => void

    connectedCallback() {
        this.setAttribute('class', styling.dropdown.modal)
        /**
         * Hide dropdown on pressing escape
         */
        document.addEventListener('keyup', (e) => e.code === 'Escape' && this.hide())
    }

    disconnectCallback() {
        if (this.#updater) {
            this.#updater()
        }
    }

    setPlacement(placement: Placement) {
        this.#placement = placement
    }

    getPlacement() {
        return this.#placement;
    }

    getReference() {
        return this.#reference;
    }

    renderHTML(html: TemplateResult) {
        render(html, this)
    }

    updatePosition() {
        return computePosition(this.getReference()!, this, { placement: this.getPlacement() }).then(({ x, y }) => {            
            this.style.top = `${y}px`
            this.style.left = `${x}px`
        })
    }

    async show(reference: HTMLElement) {        
        this.#reference = reference;
        this.classList.remove('hidden')
        this.classList.add('block')
        
        this.#updater = autoUpdate(
            reference,
            this,
            this.updatePosition.bind(this)
        )

        this.render()
        
        document.addEventListener('click', this.onClickOutside.bind(this))
    }

    hide() {
        this.classList.remove('block')
        this.classList.add('hidden')
        
        document.removeEventListener('click', this.onClickOutside.bind(this))
        
        if (this.#updater) {
            this.#updater()
        }
    }

    toggle(reference: HTMLElement) {
        if (!this.checkVisibility()) {
            this.show(reference)
        } else {
            this.hide()
        }
    }

    onClickOutside(e: MouseEvent) {
        if (
            this.contains((e.target as HTMLElement)) 
            || this.#reference?.contains((e.target as HTMLElement))
        ) {
            return
        }

        this.hide()
    }

    render() {
        if(!(this.#reference instanceof PdButton)) {
            return
        }

        if (Array.isArray(this.#reference.getTemplate())) {
            const template = html`
                <nav class="list-none flex flex-col">
                    ${(this.#reference.getTemplate() as MenuItem[]).map(item => 
                        html`
                            <li>
                                <button class=${styling.dropdown.item} @click=${(e: PointerEvent) => item.action(e, this)}>
                                    ${item.icon}
                                </button>
                            </li>
                        `
                    )}
                </nav>
            `

            this.classList.add('p-1')
            this.classList.add('min-w-[150px]')

            return render(template, this)
        }

        return render(this.#reference.getTemplate(), this)
    }
}