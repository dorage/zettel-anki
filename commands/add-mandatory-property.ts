import { EditorCallback } from "types/obsidian";
import {
	extractContent,
	extractPropertySection,
	parseProperties,
	stringifyProperties,
} from "utils/markdown";

interface MandatoryProperties {
	key: string;
	value: () => string;
}

const mandatoryProperties: MandatoryProperties[] = [
	{ key: "id", value: () => Date.now().toString() },
	{ key: "anki", value: () => "true" },
	{ key: "tags", value: () => "" },
	{ key: "created", value: () => new Date().toLocaleString() },
	{ key: "modified", value: () => new Date().toLocaleString() },
];

const addMandatoryProperties: EditorCallback = async function (_, ctx) {
	const vault = ctx.app.vault;
	const file = ctx.app.workspace.getActiveFile();

	if (file == null) return;

	const rawMarkdown = await vault.read(file);

	const rawProperties = extractPropertySection(rawMarkdown);
	const rawContent = extractContent(rawMarkdown);

	const properties = parseProperties(rawProperties ?? "");

	for (const mandatoryProperty of mandatoryProperties) {
		const hasKey = properties.some(
			(property) => property.key === mandatoryProperty.key,
		);
		if (hasKey) continue;
		properties.push({
			key: mandatoryProperty.key,
			value: mandatoryProperty.value(),
		});
	}

	vault.modify(file, stringifyProperties(properties) + rawContent);
};

export { addMandatoryProperties };
