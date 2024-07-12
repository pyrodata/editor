import StarterKit from "@tiptap/starter-kit";
import { classNames } from "./utils";
import Link from "@tiptap/extension-link";
import type { EditorOptions } from "@tiptap/core";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import Underline from "@tiptap/extension-underline";

export type PdConfig = {
    editor: {
        style: string;
        config: Partial<EditorOptions>;
    },
    toolbar: {
        style: string;
    },
    button: {
        style: string;
    },
    modal: {
        backdrop: {
            style: string;
        },
        dialog: {
            style: string;
        }
    },
    dropdown: {
        style: string;
        item: {
            style: string;
        }
    }
}

export const pdConfig: PdConfig = {
    editor: {
        style: classNames(
            'block',
            'border border-gray-100 rounded-3xl *:outline-none',
            'has-[.ProseMirror-focused]:border-black asd',
            '[&>.ProseMirror]:px-4 [&>.ProseMirror]:py-4'
        ),
        config: {
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
                Underline
            ],
            content: `
                <p>Hello World!</p>
            ` 
        }
    },
    toolbar: {
        style: classNames(
            'sticky top-0 z-10 py-2 px-3',
            'flex items-center',
            'rounded-ss-3xl rounded-se-3xl',
            'bg-white'
        )
    },
    button: {
        style: classNames(
            'rounded-full p-2',
            'flex justify-center items-center',
            'hover:bg-gray-50',
            'cursor-pointer',
        )
    },
    modal: {
        backdrop: {
            style: classNames(
                'hidden',
                'absolute top-0 left-0',
                'h-screen w-screen',
                'bg-gray-400 bg-opacity-20',
                'flex justify-center items-center',
                'backdrop-blur-[2px]',
                'z-[9999]'
            )
        },
        dialog: {
            style: classNames(
                'bg-white',
                'min-w-[350px]',
                'rounded-xl',
                'shadow-md'
            )
        }
    },
    dropdown: {
        style: classNames(
            'hidden',
            'absolute top-0 left-0 z-10',
            'bg-white shadow-md shadow-gray-100',
            'border border-gray-50',
            'rounded-xl'
        ),
        item: {
            style: classNames(
                'py-2 px-4 flex items-center gap-4',
                'rounded-lg',
                'hover:bg-slate-200'
            )
        }
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