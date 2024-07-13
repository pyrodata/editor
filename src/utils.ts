let observer: MutationObserver;

export const classNames = (...classNames: string[]) => classNames.join(' ');

export const createElement = (tagName: keyof HTMLElementTagNameMap | string, attrs?: { [key: string]: string }) => {
    const element = document.createElement(tagName)

    if (attrs) {
        for (const attr of Object.keys(attrs)) {
            element.setAttribute(attr, attrs[attr])
        }
    }

    return element
}

export const generateElementName = (input: string) => {
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
    return 'pd-' + result.toLowerCase() || characters.charAt(0).toLowerCase();
}

export const registerElement = (constructor: CustomElementConstructor) => {
    const name = generateElementName(constructor.name)

    if (!customElements.get(name)) {
        customElements.define(name, constructor)
    }
}

export const kebabCase = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

export const createObserver = () => {
    if (observer) {
        return
    }

    observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue
            }

            for (let node of mutation.addedNodes) {
                if (!node.constructor.prototype.onMount) {
                    continue
                }
                
                node.constructor.prototype.onMount.apply(node)
            }
        }
    })

    observer.observe(document, { childList: true, subtree: true })
}