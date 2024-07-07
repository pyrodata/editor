import { classNames } from "@/utils"
import { TemplateResult, html, render } from "lit-html"

const showEvent = new Event('show')
const hideEvent = new Event('hide')

export class PdModal extends HTMLElement {
    protected bodyElement: HTMLDivElement;

    protected headerElement: HTMLDivElement;

    constructor() {
        super()

        this.setAttribute('class', classNames(
            'hidden',
            'absolute top-0 left-0',
            'h-screen w-screen',
            'bg-gray-400 bg-opacity-20',
            'flex justify-center items-center',
            'backdrop-blur-[2px]',
            'z-[9999]'
        ))

        this.bodyElement = document.createElement('div')
        this.headerElement = document.createElement('div')
    }

    header(title?: string) {
        return html`
            ${title ? html`<span class="text-xl font-bold">${title}</span>` : ''}
            <button @click=${() => this.hide()} class="p-2 ms-auto rounded-full bg-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        `
    }

    connectedCallback() {
        const wrapper = document.createElement('div')

        wrapper.classList.value = classNames(
            'bg-white',
            'min-w-[350px]',
            'rounded-xl',
            'shadow-sm'
        )
        this.headerElement.classList.value = classNames(
            'p-4 flex items-center'
        )
        this.bodyElement.classList.value = classNames(
            'p-4'
        )

        wrapper.append(this.headerElement, this.bodyElement)
        this.appendChild(wrapper)
    }

    show() {
        this.classList.replace('hidden', 'block')
        this.dispatchEvent(showEvent)
    }

    hide() {
        this.classList.replace('block', 'hidden')
        this.dispatchEvent(hideEvent)
    }

    render(template: TemplateResult, title?: string) {
        render(this.header(title), this.headerElement)
        render(template, this.bodyElement);
    }
}

customElements.define('pd-modal', PdModal)