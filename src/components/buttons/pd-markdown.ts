import type { PdEditor } from "../pd-editor"
import { PdButton } from "../pd-button"
import TurndownService from 'turndown'
import { parse } from 'marked'
import hljs from 'highlight.js/lib/core'
import markdown from 'highlight.js/lib/languages/markdown'

export class PdButtonMarkdown extends PdButton {
    static name = 'pd-markdown'

    isMarkdown = false

    markdownEditor: HTMLTextAreaElement

    markdownEditorText: HTMLElement

    tiptapEditor: HTMLElement

    constructor(editor: PdEditor) {
        super(editor)

        this.tiptapEditor = this.editor.tiptap.view.dom;
        this.markdownEditor = document.createElement('textarea')
        this.markdownEditorText = document.createElement('pre')
        
        this.markdownEditorText.setAttribute('contenteditable', 'true')
        this.markdownEditorText.setAttribute('spellcheck', 'false')
        this.markdownEditorText.setAttribute('autocomplete', 'false')
        this.markdownEditorText.setAttribute('autocapitalize', 'false')
        this.markdownEditorText.setAttribute('class', 'not-prose text-balance outline-none language-markdown')

        hljs.registerLanguage('markdown', markdown)
    }

    async connectedCallback() {
        super.connectedCallback()

        if (document.documentElement.classList.contains('light')) {
            await import('highlight.js/styles/github.min.css');
        }

        if (document.documentElement.classList.contains('dark')) {
            await import('highlight.js/styles/github-dark-dimmed.min.css');
        }
    }

    getIcon() {
        return '<span class="block text-xs px-2 font-semibold">Markdown editor</span>';
    }

    getTitle() {
        return 'Toggle markdown editor'
    }

    toMarkdown() {
        const turndownService = new TurndownService({ headingStyle: 'atx' })

        /**
         * Remove double linebreaks from list items
         */
        turndownService.addRule('strikethrough', {
            filter: ['ol', 'ul'],
            replacement: function (content) {
                return content.replace(/\n\s*\n/g, '\n')
            }
        })

        this.editor.removeChild(this.editor.tiptap.view.dom)
        this.editor.appendChild(this.markdownEditorText)

        const markdown = turndownService.turndown(
            this.editor.tiptap.getHTML()
        )
        
        this.markdownEditorText.innerHTML = markdown
        hljs.highlightElement(this.markdownEditorText)
    }

    toHTML() {
        this.editor.removeChild(this.markdownEditorText)
        this.editor.appendChild(this.tiptapEditor)
        
        this.editor.tiptap.commands.setContent(
            parse(this.markdownEditorText.innerText)
        )
    }

    onClick() {
        if (!this.isMarkdown) {
            this.toMarkdown()
        }

        if (this.isMarkdown) {
            this.toHTML()
        }

        for(const group in this.editor.toolbar.groups) {
            if (group === 'md') {
                continue
            }

            this.editor.toolbar.groups[group].el.classList.toggle('hidden')
        }

        this.isMarkdown = !this.isMarkdown
        this.classList.toggle('active')
    }

    highlight() {
        this.markdownEditorText.innerHTML = hljs.highlight(this.markdownEditorText.innerText, { language: 'md' }).value
    }
}