import type { EditorConfig } from "./editor";
import StarterKit from "@tiptap/starter-kit";
import { PdButtonBold } from "./components/buttons/button-bold";
import { PdButtonBulletList } from "./components/buttons/button-bullet-list";
import { PdButtonCode } from "./components/buttons/button-code";
import { PdButtonCodeBlock } from "./components/buttons/button-code-block";
import { PdButtonHeading } from "./components/buttons/button-heading";
import { PdButtonImage } from "./components/buttons/button-image";
import { PdButtonItalic } from "./components/buttons/button-italic";
import { PdButtonLink } from "./components/buttons/button-link";
import { PdButtonOrderedList } from "./components/buttons/button-ordered-list";
import { PdButtonStrike } from "./components/buttons/button-strikethrough";
import { PdButtonTable } from "./components/buttons/button-table";
import { PdButtonUnderline } from "./components/buttons/button-underline";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { classNames } from "./utils";
import { EditorOptions } from "@tiptap/core";

export type EditorClasses = {
    editor: string
    toolbar: string
    button: string
    modal: {
        backdrop: string
        dialog: string
    }
    dropdown: {
        modal: string
        item: string
    }
}

export const buttons = {
    heading: [
        PdButtonHeading
    ],
    format: [
        PdButtonBold,
        PdButtonItalic,
        PdButtonUnderline,
        PdButtonStrike,
        PdButtonCode
    ],
    lists: [
        PdButtonOrderedList,
        PdButtonBulletList
    ],
    table: [
        PdButtonTable
    ],
    blocks: [
        PdButtonLink,
        PdButtonImage,
        PdButtonCodeBlock,
    ]
}

export const extensions: EditorOptions['extensions'] = [
    StarterKit.configure({
        bulletList: {
            itemTypeName: 'listItem',
            HTMLAttributes: { class: '[&_p]:m-0' }
        },
        orderedList: {
            HTMLAttributes: { class: '[&_p]:m-0' }
        },
    }),
    Link.configure({
        openOnClick: false
    }),
    Table.configure({
        resizable: false,
        lastColumnResizable: false,
    }),
    TableHeader,
    TableRow,
    TableCell,
    Underline,
    Image
]

export const classes: EditorClasses = {
    editor: classNames(
        'block overflow-clip',
        'border-2 border-gray-100 rounded-lg *:outline-none',
        'has-[.ProseMirror-focused]:border-gray-300',
        'has-[pre:focus]:border-gray-300',
        '[&>.ProseMirror]:px-4 [&>.ProseMirror]:py-4',
        '[&>pre]:w-full [&>pre]:h-full [&>pre]:px-4 [&>pre]:py-4',
        'dark:border-woodsmoke-700',
        'dark:bg-woodsmoke-950'
    ),
    toolbar: classNames(
        'sticky top-0 z-10 py-2 px-3',
        'flex items-center',
        'bg-white border-b-2 border-gray-100',
        'dark:bg-woodsmoke-950 dark:text-white',
        'dark:border-woodsmoke-900'
    ),
    button: classNames(
        'rounded-full p-2',
        'flex justify-center items-center',
        'cursor-pointer',
        'hover:bg-slate-200',
        'dark:hover:bg-woodsmoke-700',
        '[&.active]:bg-slate-200',
        '[&.active]:dark:bg-woodsmoke-700',
    ),
    modal: {
        backdrop: classNames(
            'hidden',
            'absolute top-0 left-0',
            'h-screen w-screen',
            'bg-gray-400 bg-opacity-20',
            'flex justify-center items-center',
            'backdrop-blur-[2px]',
            'z-[9999]',
            'dark:bg-woodsmoke-500 dark:bg-opacity-20'
        ),
        dialog: classNames(
            'bg-white',
            'min-w-[350px]',
            'rounded-xl',
            'shadow-md',
            'dark:bg-woodsmoke-900 dark:text-white',
        )
    },
    dropdown: {
        modal: classNames(
            'hidden',
            'absolute top-0 left-0 z-10',
            'bg-white',
            'border-2 border-gray-50',
            'rounded-xl',
            'dark:bg-woodsmoke-950 dark:text-white',
            'dark:border-woodsmoke-700'
        ),
        item: classNames(
            'py-2 px-4 flex items-center gap-4',
            'w-full rounded-lg',
            'hover:bg-slate-200',
            'dark:hover:bg-woodsmoke-800'
        )
    }
}

export const defaultConfig: EditorConfig = {
    classes,
    toolbar: {
        buttons,
    },
    tiptap: {
        content: '',
        extensions
    }
}