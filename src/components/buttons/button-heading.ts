import { html } from "@/lit";
import { PdButton } from "../pd-button";

export class PdButtonHeading extends PdButton {
    type() {
        return 'dropdown' as const
    }

    icon() {
        return '<i data-lucide="heading"></i>';
    }

    isActive() {
        return this.editor.isActive('heading');
    }
    
    dropdownTemplate() {
        return [
            {
                title: 'H2',
                icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>`,
                action: () => {
                    this.editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            },
            {
                title: 'H3',
                icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-3"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`,
                action: () => {
                    this.editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
            },
            {
                title: 'H4',
                icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-4"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/></svg>`,
                action: () => {
                    this.editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
            },
            {
                title: 'H5',
                icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-5"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 13v-3h4"/><path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>`,
                action: () => {
                    this.editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
            },
            {
                title: 'H6',
                icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-6"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></svg>`,
                action: () => {
                    this.editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
            }
        ]
    }
}

customElements.define('pd-button-heading', PdButtonHeading);