import { classNames } from "@/utils";

export class PyrodataButton extends HTMLElement {

    constructor(icon: string) {
        super();

        this.setAttribute('class', classNames(
            'flex'
        ))
        this.innerHTML = icon;
    }
}

customElements.define('pd-button', PyrodataButton);