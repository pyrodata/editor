import { html, render, type TemplateResult } from "lit"
import { PdButton } from "./pd-button";
import { defaultConfig } from "../config";

const showEvent = new Event('show')
const hideEvent = new Event('hide')

export class PdModal extends HTMLElement {
    /**
     * A reference to the element that activated the modal
     */
    protected reference?: HTMLElement | PdButton;

    constructor() {
        super()

        this.setAttribute('class', defaultConfig.classes.modal!.backdrop)
        document.addEventListener('keyup', (e) => e.code === 'Escape' && this.hide())
    }

    show(reference: HTMLElement | PdButton) {
        this.reference = reference

        this.classList.replace('hidden', 'block')
        this.dispatchEvent(showEvent)

        this.render()
    }

    hide() {
        this.classList.replace('block', 'hidden')
        this.dispatchEvent(hideEvent)
    }

    toggle(reference: HTMLElement | PdButton) {
        if (!this.checkVisibility()) {
            this.show(reference)
        } else {
            this.hide()
        }
    }

    render() {
        let body: TemplateResult | string = ''
        let title = ''

        if (this.reference instanceof PdButton) {
            title = this.reference.getTitle
                ? this.reference.getTitle()
                : ''
            body = this.reference.getTemplate 
                ? this.reference.getTemplate() as TemplateResult | string
                : ''
        }

        const template = html`
            <div  class=${defaultConfig.classes.modal!.dialog}>
                <div class="p-4 flex items-center">
                    ${
                        title !== '' 
                            ? html`<span class="text-xl font-bold">${title}</span>` 
                            : ``
                    }
                    <button @click=${() => this.hide()} class="p-2 ms-auto rounded-full bg-slate-200 dark:bg-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <div class="p-4">
                    ${body}
                </div>
            </div>
        `
        render(template, this)
    }
}