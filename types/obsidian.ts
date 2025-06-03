import { Editor, MarkdownFileInfo, MarkdownView } from "obsidian";

export type EditorCallback = (
	editor: Editor,
	ctx: MarkdownView | MarkdownFileInfo,
) => any;
