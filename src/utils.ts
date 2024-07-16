let observer: MutationObserver;

/**
 * Joins multiple class names into a single string separated by spaces.
 * 
 * @param {...string[]} classNames - The class names to join.
 * @returns {string}
 */
export const classNames = (...classNames: string[]): string => classNames.join(' ');

/**
 * Creates an HTML element with the specified tag name and attributes.
 * 
 * @param {keyof HTMLElementTagNameMap | string} tagName - The tag name of the element to create.
 * @param {{ [key: string]: string }} [attrs] - Optional attributes to set on the element.
 * @returns {HTMLElement} - The created HTML element.
 */
export const createElement = (tagName: keyof HTMLElementTagNameMap | string, attrs?: { [key: string]: string }): HTMLElement => {
    const element = document.createElement(tagName);

    if (attrs) {
        for (const attr of Object.keys(attrs)) {
            element.setAttribute(attr, attrs[attr]);
        }
    }

    return element;
}

/**
 * Generates a deterministic unique element name based on the input string.
 * 
 * @param {string} input - The input string to generate the element name from.
 * @returns {string}
 */
export const generateElementName = (input: string): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Hash the input string to produce a deterministic number
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }

    // Convert the hash number to a string using the character set
    const charactersLength = characters.length;
    let result = '';
    let num = Math.abs(hash);
    while (num > 0) {
        result = characters.charAt(num % charactersLength) + result;
        num = Math.floor(num / charactersLength);
    }

    // If the result is empty (e.g., hash was 0), return the first character
    return 'pd-' + (result.toLowerCase() || characters.charAt(0).toLowerCase());
}

/**
 * Registers a custom element with a generated name based on the constructor's name.
 * 
 * @param {CustomElementConstructor} constructor - The constructor of the custom element to register.
 */
export const registerElement = (constructor: CustomElementConstructor): void => {
    const name = generateElementName(constructor.name);

    if (!customElements.get(name)) {
        customElements.define(name, constructor);
    }
}

/**
 * Converts a string to kebab-case (lowercase words separated by hyphens).
 * 
 * @param {string} str - The string to convert.
 * @returns {string}
 */
export const kebabCase = (str: string): string => 
    str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());

/**
 * Creates a mutation observer to detect added nodes and call their `onMount` method if it exists.
 */
export const createObserver = (): void => {
    if (observer) {
        return;
    }

    observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }

            for (let node of mutation.addedNodes) {
                if (!node.constructor.prototype.onMount) {
                    continue;
                }

                node.constructor.prototype.onMount.apply(node);
            }
        }
    });

    observer.observe(document, { childList: true, subtree: true });
}