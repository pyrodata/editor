import type { Icon } from 'lucide-svelte';
import type { Snippet } from 'svelte';
import type { Editor as E } from '@tiptap/core';
import Editor from "./Editor.svelte";
import DropdownItem from "./DropdownItem.svelte";

export type EditorProps = {
    value: string | null;
    buttons?: string;
}

export type EditorToolbarProps = {
    buttons?: string;
    editor: E;
}

export type ButtonGroup = {
    btns: ButtonProps[];
}

export type ButtonProps = {
    icon: typeof Icon,
    onclick: () => void;
    title: string;
}

export type ButtonDropdownProps = {
    icon: typeof Icon;
    title: string;
    children: Snippet;
    isActive?: boolean;
}

export type ButtonDialogProps = {
    icon: typeof Icon;
    title: string;
    onclick: () => void;
    children: Snippet;
    isActive?: boolean;
    open: boolean;
}

export type DropdownItemProps = {
    children: Snippet;
}

export const classNames = (...classNames: string[]) => classNames.join(' ');

export {
    Editor,
    DropdownItem
}