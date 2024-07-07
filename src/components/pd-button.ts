import { classNames } from "@/utils";
import { Editor } from "@tiptap/core";

export abstract class PdButton extends HTMLElement {
    public abstract icon: string;

    constructor(protected editor: Editor) {
        super();
    }

    connectedCallback() {
        this.setAttribute('class', classNames(
            'rounded-full p-2',
            'flex justify-center items-center',
            'hover:bg-gray-50',
            'cursor-pointer',
            '[&[open]>div]:block'
        ));

        this.insertAdjacentHTML('beforeend', this.icon);
    }
}