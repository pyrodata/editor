import type { TemplateResult } from 'lit-html';
import { computePosition } from '@floating-ui/dom';
import { html, render } from '@/lit';
import { PdButton } from './pd-button';
import { pdConfig } from '@/config';

export type MenuItem = {
    title: string;
    icon: TemplateResult;
    action: (e: PointerEvent, dropdown: PdDropdown) => void;
}

export class PdDropdown extends HTMLElement {
    reference?: HTMLElement | PdButton;

    connectedCallback() {
        this.setAttribute('class', pdConfig.dropdown.style)
        /**
         * Hide dropdown on pressing escape
         */
        document.addEventListener('keyup', (e) => e.code === 'Escape' && this.hide())
    }

    renderHTML(html: TemplateResult) {
        render(html, this)
    }

    async show(reference: HTMLElement) {
        const { x, y } = await computePosition(reference, this, { placement: 'bottom-start' })
        
        this.reference = reference;
        this.classList.remove('hidden')
        this.classList.add('block')
        
        this.style.top = `${y}px`
        this.style.left = `${x}px`

        this.render()
        
        document.addEventListener('click', this.onClickOutside.bind(this))
    }

    hide() {
        this.classList.remove('block')
        this.classList.add('hidden')

        document.removeEventListener('click', this.onClickOutside.bind(this))
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
            || this.reference?.contains((e.target as HTMLElement))
        ) {
            return
        }

        this.hide()
    }

    render() {
        if(!(this.reference instanceof PdButton)) {
            return
        }

        if (Array.isArray(this.reference.getTemplate())) {
            const template = html`
                <nav class="list-none flex flex-col">
                    ${(this.reference.getTemplate() as MenuItem[]).map(item => 
                        html`
                            <li>
                                <button class="p-2 w-full rounded-lg hover:bg-gray-50" @click=${(e: PointerEvent) => item.action(e, this)}>
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

        return render(this.reference.getTemplate(), this)
    }
}

customElements.define('pd-dropdown', PdDropdown);