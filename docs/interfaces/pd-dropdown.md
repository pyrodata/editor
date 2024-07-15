# PdDropdown

If an instance of this element does not already exist in the DOM,
it is automatically appended when the `createEditor` function is called.

```ts
type Placement = 
    "top" 
    | "left" 
    | "right" 
    | "bottom" 
    | "top-start" 
    | "top-end" 
    | "left-start"
    | "left-end" 
    | "right-start" 
    | "right-end" 
    | "bottom-start" 
    | "bottom-end"

export class PdDropdown extends HTMLElement {
    /**
     * Sets the placement of the dropdown.
     */
    setPlacement(placement: Placement): Placement

    /**
     * Gets the current placement of the dropdown.
     */
    getPlacement(): Placement

    /**
     * Gets the reference element for the dropdown.
     */
    getReference(): HTMLElement | PdButton | undefined

    /**
     * Renders HTML content inside the dropdown.
     */
    renderHTML(html: TemplateResult): void

    /**
     * Updates the position of the dropdown based on its reference element.
     * 
     * Uses the computePosition function to determine the new position and applies it.
     */
    updatePosition(): Promise<void>

    /**
     * Shows the dropdown and sets it up for position updates.
     */
    show(reference: HTMLElement): Promise<void>

    /**
     * Hides the dropdown and stops position updates.
     */
    hide(): void

    /**
     * Toggles the visibility of the dropdown.
     * 
     * If the dropdown is not visible, it is shown; otherwise, it is hidden.
     */
    toggle(reference: HTMLElement): void

    /**
     * Handles clicks outside the dropdown to hide it.
     */
    onClickOutside(e: MouseEvent): void

    /**
     * Renders the content of the dropdown based on the reference element's template.
     * 
     * If the reference is a PdButton and has a template, it renders the template inside the dropdown.
     */
    render(): void
}
```