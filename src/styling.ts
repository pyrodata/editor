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

export const classes: EditorStyling = {
    editor: classNames(
        'block overflow-clip',
        'border-2 border-gray-100 rounded-lg *:outline-none',
        'has-[.ProseMirror-focused]:border-gray-300',
        '[&>.ProseMirror]:px-4 [&>.ProseMirror]:py-4',
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