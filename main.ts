import { addMandatoryProperties } from "commands/add-mandatory-property";
import { exportToAnki } from "commands/export-to-anki";
import { Plugin } from "obsidian";

// Remember to rename these classes and interfaces!

interface ZettelAnkiPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ZettelAnkiPluginSettings = {
	mySetting: "default",
};

export default class ZettelAnkiPlugin extends Plugin {
	settings: ZettelAnkiPluginSettings;

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
