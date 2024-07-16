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
import { PdButtonCode } from './components/buttons/button-code'
import { PdButtonCodeBlock } from './components/buttons/button-code-block'

import { createEditor } from './editor'
import { buttons, classes } from './config'

document.addEventListener('DOMContentLoaded', async () => {
    const reference = document.getElementById('editor') as HTMLDivElement
    const reference2 = document.getElementById('editor-2') as HTMLDivElement

    const test = createEditor(reference, {
        tiptap: {
            content: 'Hi'
        }
    })

    console.log(test)
})