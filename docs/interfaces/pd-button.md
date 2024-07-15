# PdButton

Base class of a [custom button](../advanced-usage/create-a-custom-button.md)

```ts
export class PdButton extends HTMLElement {
    /**
     * Retrieves the icon for the button.
     * 
     * The icon is obtained from https://lucide.dev/icons/.
     */
    getIcon(): string

    /**
     * Retrieves the button type.
     * 
     * The possible types are `button`, `dropdown`, or `modal`. 
     * The default type is `button`.
     */
    getType(): 'button' | 'dropdown' | 'modal'

    /**
     * Retrieves the title for the button.
     * 
     * This title is used as a tooltip. In the case of a modal, it is also
     * used as the header title.
     */
    getTitle(): string

    /**
     * Determines whether the button should be in an active state.
     * 
     * This function is called each time the editor emits a transaction,
     * allowing for dynamic checks to set the button's active state.
     */
    isActive(): boolean

    /**
     * Generates a template to render inside a modal or dropdown.
     * 
     * If the button is a dropdown, the `MenuItem` array can also be is used.
     */
    getTemplate(): string | TemplateResult | MenuItem[]

    /**
     * Callback function that is triggered when the button is clicked.
     * 
     * This is not needed for buttons of type `modal` or `dropdown`.
     */
    onClick(): void

    constructor(
        /**
         * Reference to TipTap editor
         */
        protected editor: Editor,
        /**
         * Reference to dropdown element
         */
        protected dropdown: PdDropdown,
        /**
         * Reference to modal element
         */
        protected modal: PdModal
    )
    
    /**
     * Invoked when the custom element is first connected to the document's DOM.
     * 
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components#connectedcallback}
     */
    connectedCallback(): void

    /**
     * Invoked when the custom element is disconnected from the document's DOM.
     * 
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components#disconnectedcallback}
     */
    disconnectedCallback(): void

    /**
     * This method is called to set the button to an active state.
     * 
     * By default, it adds the 'active' class to the button's 
     * class list, which can be used to apply specific 
     * styles or behaviors associated with the active state.
     * 
     * @default 
     * 
     * ```ts
     * this.classList.add('active')
     * ```
     * 
     * You can customize this behavior by overriding the `setActive` method 
     * in your custom button implementation.
     */
    setActive(): void

    /**
     * This method is called to set the button to an inactive state.
     * 
     * By default, it removes the 'active' class from the button's 
     * class list, which can be used to remove styles or behaviors 
     * associated with the active state.
     * 
     * @default 
     * 
     * ```ts
     * this.classList.remove('active')
     * ```
     * 
     * You can customize this behavior by overriding the `setInactive` method 
     * in your custom button implementation.
     */
    setInactive(): void

    /**
     * Toggles button between active and inactive
     */
    toggleActive(): void
}
```