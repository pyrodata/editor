import { classNames } from "@/utils";

export class PyrodataButtonGroup extends HTMLElement {

    constructor() {
        super();

        this.setAttribute('class', classNames(
            'flex'
        ))
    }
}

customElements.define('pd-button-group', PyrodataButtonGroup);