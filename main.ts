import {
	mandatoryProperty,
	mandatoryPropertyKey,
	mandatoryPropertyKeys,
} from "data/property";
import { Notice, Plugin, TFile } from "obsidian";
import * as path from "path";
import { addNote, findNote, storeMediaFile } from "utils/anki";
import {
	extractContent,
	extractPropertySection,
	obsidianToMarkdown,
	parseContent,
	parseProperties,
} from "utils/markdown";
import { getVaultPath } from "utils/obsidian";
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

	private isExportingToAnki = false;

	private async exportResourceToAnki(file: TFile) {
		return storeMediaFile({
			filename: file.name,
			path: path.resolve(getVaultPath(), file.path),
		});
	}

	private async exportZettelToAnki(file: TFile) {
		const rawMarkdown = await this.app.vault.read(file);

		// 프로퍼티가 존재하는지 확인
		const rawPropertySction = extractPropertySection(rawMarkdown);
		if (rawPropertySction == null) return;

		// 특정 프로퍼티들이 존재하는지 확인
		const properties = parseProperties(rawPropertySction!);

		const anki = properties.find((v) => v.key === "anki")?.value;
		const id = properties.find((v) => v.key === "id")?.value;

		// 프로퍼티가 없을 경우
		if (anki == null || id == null) return;
		// anki 가 아직 활성화되지 않은 경우
		if (anki === "false") return;

		const rawContent = extractContent(rawMarkdown);
		const content = parseContent(rawContent!);

		if (await findNote("zettel-anki", id)) {
			console.error("이미 추가된 노트");
			return;
		}

		const front = (
			await markdownToHTML(obsidianToMarkdown(content!.front))
		).value.toString();
		const back = (
			await markdownToHTML(obsidianToMarkdown(content!.back))
		).value.toString();

		return addNote({
			deck: "zettel-anki",
			fields: {
				id,
				front,
				back,
			},
			tags: [],
		});
	}

	// modified 프로퍼티를 업데이트하는 콜백
	private onModified = async (file: TFile) => {
		this.app.fileManager.processFrontMatter(file, (matter) => {
			const anki = mandatoryPropertyKey.anki;
			const modified = mandatoryPropertyKey.modified;

			if (matter[anki] == null) return;

			matter[modified] = mandatoryProperty[modified]();
		});
	};

	async onload() {
		await this.loadSettings();

		// update "modified" property
		this.app.vault.on("modify", this.onModified);

		this.addCommand({
			id: "add-mandatory-property",
			name: "Add mandatory properties",
			editorCallback: (_, ctx) => {
				if (ctx.file == null) return;

				ctx.app.fileManager.processFrontMatter(ctx.file, (matter) => {
					for (const key of mandatoryPropertyKeys) {
						if (matter[key] != null) continue;
						matter[key] = mandatoryProperty[key]();
					}
				});
			},
		});

		this.addCommand({
			id: "export-to-anki",
			name: "Export to Anki",
			editorCallback: async (editor, ctx) => {
				if (this.isExportingToAnki) return;
				this.isExportingToAnki = true;
				new Notice(`Anki로 업로드 시작`);
				const promises = ctx.app.vault.getFiles().map((file) => {
					return file.extension === "md"
						? this.exportZettelToAnki(file)
						: this.exportResourceToAnki(file);
				});
				const results = await Promise.all(promises);
				console.debug(results);
				new Notice(`Anki로 업로드 완료`);
				this.isExportingToAnki = true;
			},
		});
	}

	onunload() {
		this.app.vault.off("modify", this.onModified);
	}

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
