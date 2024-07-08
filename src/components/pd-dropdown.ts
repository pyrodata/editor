import type { TemplateResult } from 'lit-html';
import { computePosition } from '@floating-ui/dom';
import { html, render } from '@/lit';
import { classNames } from '@/utils';

export type MenuItem = {
    title: string;
    icon: TemplateResult;
    action: (e: PointerEvent, dropdown: PdDropdown) => void;
}

export class PdDropdown extends HTMLElement {
    reference?: HTMLElement;

    connectedCallback() {
        this.setAttribute('class', classNames(
            'hidden',
            'absolute top-0 left-0 z-10',
            'bg-white shadow-md shadow-gray-100',
            'border border-gray-50',
            'rounded-xl'
        ))
    }

    /**
     * Render as a dropdown menu
     * 
     * @param items     - Dropdown menu items
     */
    renderMenu(items: MenuItem[]) {
        const tpl = html`
            <nav class="list-none flex flex-col">
                ${items.map(item => 
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

        render(tpl, this)
    }

    renderHTML(html: TemplateResult) {
        render(html, this)
    }

    async show(reference: HTMLElement) {
        const { x, y } = await computePosition(reference, this, { placement: 'bottom-start' })
        
        this.classList.remove('hidden')
        this.classList.add('block')
        
        this.style.top = `${y}px`
        this.style.left = `${x}px`

        this.reference = reference;

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
}

customElements.define('pd-dropdown', PdDropdown);