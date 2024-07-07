import { html } from "@/lit";
import { PdDropdown } from "../pd-dropdown";

export class PyrodataButtonHeading extends PdDropdown {
    icon = `<i data-lucide="heading"></i>`;
    
    items() {
        return [
            {
                icon: html`<i data-lucide="heading-2"></i>`,
            },
            {
                icon: html`<i data-lucide="heading-3"></i>`
            },
            {
                icon: html`<i data-lucide="heading-4"></i>`
            },
            {
                icon: html`<i data-lucide="heading-5"></i>`
            },
            {
                icon: html`<i data-lucide="heading-6"></i>`
            }
        ]
    }
}

customElements.define('pd-button-heading', PyrodataButtonHeading);