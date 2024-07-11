import { pdConfig } from "@/config";
import { PdButton } from "./pd-button";
import { PdEditor } from "./pd-editor";
import { createElement, registerElement } from "@/utils";
import { getDropdown, getModal } from "@/editor";

export type ButtonGroup = {
    [key: string]: {
        el: HTMLElement
        buttons: PdButton[]
    }
}

export class PdEditorToolbar extends HTMLElement {
    groups: ButtonGroup = {}

    registeredButtons: {[key: string]: PdButton} = {}

    constructor() {
        super();

        ['buttonAdded', 'groupRegistered', 'groupUnregistered'].forEach(event => 
            this.addEventListener(event, this.rerender.bind(this)
        ))
    }

    connectedCallback() {
        this.setAttribute('class', pdConfig.toolbar.style);
    }

    /**
     * Registers and adds a new button to the toolbar
     * 
     * @param button 
     * @param editor 
     */
    addButton(groupName: keyof ButtonGroup, button: typeof PdButton, editor: PdEditor) {
        if (!this.groups[groupName]) {
            throw new Error(`The group named '${groupName}' does not exist. Please ensure you have spelled the group name correctly or verify that a group with this name has been registered.`)
        }

        registerElement(button)

        const group = this.groups[groupName]
        const btn = new button(
            editor.getEditor(),
            getDropdown(),
            getModal()
        )

        group.buttons.push(btn)

        this.dispatchEvent(new CustomEvent('buttonAdded', { detail: btn }))
    }

    /**
     * Register a new group with buttons to the toolbar
     * 
     * Existing groups must be unregistered first before overwriting
     * 
     * @param name 
     * @param editor 
     * @param buttons 
     */
    registerGroup(name: string, editor: PdEditor, buttons: typeof PdButton[] = []) {
        /**
         * We cannot overwrite existing groups
         * If we want to do so we need to unregisterGroup first
         */
        if (this.groups[name]) {
            throw new Error(`A group with name ${name} already exists, if this was intentional \`unregisterGroup\` first.`)
        }

        const groupEl = createElement('pd-button-group', { id: `group-${name}`, class: 'flex ms-2' })

        this.groups[name] = {
            el: groupEl,
            buttons: []
        }
        buttons.forEach(button => this.addButton(name, button, editor))

        this.dispatchEvent(new CustomEvent('groupRegistered', { detail: this.groups[name] }))
    }

    /**
     * Removes a group from the toolbar
     * 
     * All buttons registered on this group will be deleted aswell
     * 
     * @param name 
     */
    unregisterGroup(name: string) {
        delete this.groups[name]

        this.dispatchEvent(new CustomEvent('groupUnregistered', { detail: this.groups[name] }))
    }

    /**
     * Rerenders all buttons
     * 
     * Some events requires the toolbar from rerendering, like when you add or remove a button
     */
    rerender() {
        this.replaceChildren()
        
        for (const [_, group] of Object.entries(this.groups)) {
            group.buttons.forEach(button => {
                group.el.append(button)
            })

            this.append(group.el)
        }
    }
}