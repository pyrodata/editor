import { PdButton } from "./pd-button";
import { classNames, createElement, registerElement } from "../utils";
import type { PdEditor } from "./pd-editor";
import { PdButtonMarkdown } from "./buttons/pd-markdown";

export type ButtonGroup = {
    [key: string]: {
        el: HTMLElement
        buttons: PdButton[]
    }
}

export class PdEditorToolbar extends HTMLElement {
    groups: ButtonGroup = {}
    
    constructor(
        readonly editor: PdEditor
    ) { super() }

    connectedCallback() {
        this.setAttribute('class', this.editor.config.classes.toolbar!)

        /**
         * Add all the buttons that are registered within the editor
         */
        for (const name in this.editor.config.toolbar.buttons) {
            this.registerGroup(name, this.editor.config.toolbar.buttons[name])
        }

        this.registerGroup('md', [PdButtonMarkdown])
    }

    /**
     * Registers and adds a new button to the toolbar
     * 
     * @param button 
     * @param editor 
     */
    addButton(groupName: keyof ButtonGroup, button: typeof PdButton) {
        if (!this.groups[groupName]) {
            throw new Error(`The group named '${groupName}' does not exist. Please ensure you have spelled the group name correctly or verify that a group with this name has been registered.`)
        }

        registerElement(button)

        const group = this.groups[groupName]
        const btn = new button(this.editor)

        group.buttons.push(btn)
        group.el.append(btn)
    }

    /**
     * Removes a button from the toolbar
     * 
     * @param name      - name of the button to remove
     */
    removeButton(name: string) {
        this.groups.format.buttons.find(btn => btn.constructor.name === name)?.remove()
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
    registerGroup(name: string, buttons: typeof PdButton[] = []) {
        /**
         * We cannot overwrite existing groups
         * If we want to do so we need to unregisterGroup first
         */
        if (this.groups[name]) {
            throw new Error(`A group with name ${name} already exists, if this was intentional \`unregisterGroup\` first.`)
        }

        const groupEl = createElement('pd-button-group', { 
            id: `group-${name}`, 
            class: classNames(
                'flex me-[1rem] relative',
                'after:content-[\' \'] after:h-[1.2rem] after:w-[1px] after:bg-gray-100',
                'after:absolute after:top-1/2 after:-right-[.54rem] after:-translate-y-1/2',
                'last:after:hidden last:me-0 last:ms-auto'
            ) 
        })

        this.groups[name] = {
            el: groupEl,
            buttons: []
        }
        buttons.forEach(button => this.addButton(name, button))

        this.append(this.groups[name].el)
    }

    /**
     * Removes a group from the toolbar
     * 
     * All buttons registered on this group will be deleted aswell
     * 
     * @param name 
     */
    unregisterGroup(name: string) {
        this.groups[name].el.remove()
        this.groups[name].buttons.forEach(btn => btn.remove())

        delete this.groups[name]
    }
}