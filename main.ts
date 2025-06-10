import { addMandatoryProperties } from "commands/add-mandatory-property";
import { exportToAnki } from "commands/export-to-anki";
import { Plugin } from "obsidian";
import {
	extractContent,
	extractPropertySection,
	obsidianToMarkdown,
	parseContent,
	parseProperties,
} from "utils/markdown";
import { markdownToHTML } from "utils/remark";

// Remember to rename these classes and interfaces!

interface ZettelAnkiPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ZettelAnkiPluginSettings = {
	mySetting: "default",
};

export default class ZettelAnkiPlugin extends Plugin {
	settings: ZettelAnkiPluginSettings;

	private async isZettelAnkiFormat() {
		const vault = this.app.vault;
		const file = this.app.workspace.getActiveFile();
		if (file == null) return;
		const rawMarkdown = await vault.read(file);

		const rawPropertySction = extractPropertySection(rawMarkdown);
		const rawContent = extractContent(rawMarkdown);

		const propertySection = parseProperties(rawPropertySction ?? "");
		const content = parseContent(rawContent ?? "");

		const id = propertySection.find((v) => v.key === "id")!;
		const anki = propertySection.find((v) => v.key === "anki")!;
		const tags = propertySection.find((v) => v.key === "tags")!;
	}

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "add-mandatory-property",
			name: "Add mandatory properties",
			editorCallback: addMandatoryProperties,
		});

		this.addCommand({
			id: "export-to-anki",
			name: "Export to Anki",
			editorCallback: exportToAnki,
		});

		this.addCommand({
			id: "extract-property",
			name: "Extract Property",
			editorCallback: async (editor, ctx) => {
				const vault = ctx.app.vault;
				const file = ctx.app.workspace.getActiveFile();
				if (file == null) return;
				const rawMarkdown = await vault.read(file);

				const rawPropertySction = extractPropertySection(rawMarkdown);
				const rawContent = extractContent(rawMarkdown);
				const properties = parseProperties(rawPropertySction!);
				const content = parseContent(rawContent!);

				console.log(
					(await markdownToHTML(obsidianToMarkdown(content!.front)))
						.value,
					(await markdownToHTML(obsidianToMarkdown(content!.back)))
						.value,
				);
			},
		});

		this.addCommand({
			id: "export-to-html",
			name: "Export to HTML",
			editorCallback: async (editor, ctx) => {
				const vault = ctx.app.vault;
				const file = ctx.app.workspace.getActiveFile();
				if (file == null) return;
				const rawMarkdown = await vault.read(file);

				const rawPropertySction = extractPropertySection(rawMarkdown);
				const rawContent = extractContent(rawMarkdown);

				const propertySection = parseProperties(
					rawPropertySction ?? "",
				);
				const content = parseContent(rawContent ?? "");

				const id = propertySection.find((v) => v.key === "id")!;
				const anki = propertySection.find((v) => v.key === "anki")!;
				const tags = propertySection.find((v) => v.key === "tags")!;
			},
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
