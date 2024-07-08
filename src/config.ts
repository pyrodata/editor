import StarterKit from "@tiptap/starter-kit";
import { classNames } from "./utils";
import Link from "@tiptap/extension-link";
import type { EditorOptions } from "@tiptap/core";

export type PdConfig = {
    editor: {
        style: string;
        config: Partial<EditorOptions>;
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
                })
            ],
            content: '<p>Hello World!</p>' 
        }
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
                'shadow-sm'
            )
        }
    }
}