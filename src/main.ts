import './style.css'

import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { PdButtonBold } from './components/buttons/button-bold'
import { PdButtonHeading } from './components/buttons/button-heading'
import { PdButtonItalic } from './components/buttons/button-italic'
import { PdButtonStrike } from './components/buttons/button-strikethrough'
import { PdButtonUnderline } from './components/buttons/button-underline'
import { PdButtonImage } from './components/buttons/button-image'
import { PdButtonLink } from './components/buttons/button-link'
import { PdButtonTable } from './components/buttons/button-table'
import { PdButtonOrderedList } from './components/buttons/button-ordered-list'
import { PdButtonBulletList } from './components/buttons/button-bullet-list'

import { createEditor, defaultConfig } from './editor'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import Underline from '@tiptap/extension-underline'

document.addEventListener('DOMContentLoaded', () => {
    const reference = document.getElementById('editor') as HTMLDivElement
    const reference2 = document.getElementById('editor-2') as HTMLDivElement

    defaultConfig.tiptap.content = 'TEST'

    const test = createEditor(reference, {
        toolbar: {
            buttons: {
                heading: [
                    PdButtonHeading
                ],
                format: [
                    PdButtonBold,
                    PdButtonItalic,
                    PdButtonUnderline,
                    PdButtonStrike,
                ],
                blocks: [
                    PdButtonImage
                ]
            }
        },
        tiptap: {
            extensions: [
                StarterKit,
                Link.configure({
                    openOnClick: false
                }),
                Table.configure({
                    resizable: true,
                    handleWidth: 10,
                    lastColumnResizable: true
                }),
                TableHeader,
                TableRow,
                TableCell,
                Underline,
                Image
            ],
            content: `
                <p>Hello World!</p>
            `
        }
    })
})