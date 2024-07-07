import type { TemplateResult } from "lit-html";
import { PdButton } from "./pd-button";
import { html, render } from '@/lit';
import { classNames } from "@/utils";
import { autoUpdate, computePosition } from '@floating-ui/dom';

export abstract class PdDropdown extends PdButton {
    items?(): { icon: TemplateResult }[]

    connectedCallback() {
        super.connectedCallback()

        /**
         * Insert chevron down icon
         */
        this.insertAdjacentHTML('beforeend', `<i data-lucide="chevron-down"></i>`)
        /**
         * Render component HTML
         */
        this.render()

        this.addEventListener('click', () => {
            if (this.hasAttribute('open')) {
                this.removeAttribute('open')
            } else {
                this.setAttribute('open', '')
            }
        })
    }

    render() {
        let id = `tt-${crypto.randomUUID()}`;
        let items;

        if (this.items) {
            items = html`
                <nav class="list-none flex flex-col">${this.items().map(item => html`<li class="p-2 rounded-lg hover:bg-gray-50">${item.icon}</li>`)}</nav>
            `
        }

        const template = html`
            <div
                id=${id}
                class=${classNames(
                    'p-1',
                    'hidden absolute rounded-xl',
                    'min-w-[150px]',
                    'border border-gray-50',
                    'bg-white shadow-md shadow-gray-100',
                    'peer-has-[&[open]]:bg-red-500'
                )}
            >
                ${items}
            </div>
        `

        render(template, this)

        const floatingEl = this.querySelector(`#${id}`) as HTMLElement;

        computePosition(this, floatingEl, { placement: 'bottom-start' }).then(({ x, y }) => {
            Object.assign(floatingEl.style, {
                left: `${x}px`,
                top: `${y + 10}px`,
            });
        });
    }
}