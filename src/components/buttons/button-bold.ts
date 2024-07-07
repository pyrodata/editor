import { classNames } from "@/utils";

export class PyrodataButtonBold extends HTMLElement {

    constructor() {
        super();

        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bold"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>`
        this.setAttribute('class', classNames(
            'rounded-full p-2',
            'flex justify-center items-center',
            'hover:bg-slate-200',
            'cursor-pointer'
        ));
    }
}

customElements.define('pd-button-bold', PyrodataButtonBold);