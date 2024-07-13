import { classNames } from "./utils";

export type EditorStyling = {
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

export const styling: EditorStyling = {
    editor: classNames(
        'block',
        'border border-gray-100 rounded-3xl *:outline-none',
        'has-[.ProseMirror-focused]:border-gray-300',
        '[&>.ProseMirror]:px-4 [&>.ProseMirror]:py-4',
        'dark:border-gray-400',
    ),
    toolbar: classNames(
        'sticky top-0 z-10 py-2 px-3',
        'flex items-center',
        'rounded-ss-3xl rounded-se-3xl',
        'bg-white',
        'dark:bg-gray-400 dark:text-white'
    ),
    button: classNames(
        'rounded-full p-2',
        'flex justify-center items-center',
        'cursor-pointer',
        'hover:bg-gray-50',
        'dark:hover:bg-gray-300',
        '[&.active]:bg-gray-50',
        '[&.active]:dark:bg-gray-300',
    ),
    modal: {
        backdrop: classNames(
            'hidden',
            'absolute top-0 left-0',
            'h-screen w-screen',
            'bg-gray-400 bg-opacity-20',
            'flex justify-center items-center',
            'backdrop-blur-[2px]',
            'z-[9999]'
        ),
        dialog: classNames(
            'bg-white',
            'min-w-[350px]',
            'rounded-xl',
            'shadow-md',
            'dark:bg-gray-500 dark:text-white',
        )
    },
    dropdown: {
        modal: classNames(
            'hidden',
            'absolute top-0 left-0 z-10',
            'bg-white shadow-md shadow-gray-100',
            'border border-gray-50',
            'rounded-xl',
            'dark:bg-gray-500 dark:text-white',
            'dark:border-gray-400 dark:shadow-gray-500'
        ),
        item: classNames(
            'py-2 px-4 flex items-center gap-4',
            'w-full rounded-lg',
            'hover:bg-slate-200',
            'dark:hover:bg-gray-400'
        )
    }
}

// export const defaultConfig: EditorConfig = {
//     toolbar: {
//         buttons: [
//             [
//                 PdButtonHeading
//             ],
//             [
//                 PdButtonBold,
//                 PdButtonItalic,
//                 PdButtonUnderline,
//                 PdButtonStrike
//             ]
//         ]
//     },
//     tiptap: {
//         extensions: [
//             StarterKit,
//             Link.configure({
//                 openOnClick: false
//             }),
//             Table.configure({
//                 resizable: true,
//                 handleWidth: 10,
//                 lastColumnResizable: true
//             }),
//             TableHeader,
//             TableRow,
//             TableCell,
//             Underline,
//             Image
//         ],
//         content: `
//             <p>Hello Worlds!</p>
//         `
//     }
// }