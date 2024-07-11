let observer: MutationObserver; 

export const classNames = (...classNames: string[]) => classNames.join(' ');

export const createElement = (tagName: keyof HTMLElementTagNameMap | string, attrs?: {[key: string]: string}) => {
    const element = document.createElement(tagName)

    if (attrs) {
        for (const attr of Object.keys(attrs)) {
            element.setAttribute(attr, attrs[attr])
        }
    }

    return element
}

export const registerElement = (constructor: CustomElementConstructor) => {
    const name = kebabCase(constructor.name)

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