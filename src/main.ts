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
            content: `<h1>HTML Ipsum Presents</h1>

<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="https://google.nl">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

<h2>Header Level 2</h2>

<ol>
    <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
    <li>Aliquam tincidunt mauris eu risus.</li>
</ol>

<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

<h3>Header Level 3</h3>

<ul>
    <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
    <li>Aliquam tincidunt mauris eu risus.</li>
</ul>`
        }
    })

    console.log(test)
})