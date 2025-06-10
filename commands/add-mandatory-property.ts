import { EditorCallback } from "types/obsidian";
import { hasProperty, hasPropertySection } from "utils/markdown";

interface MandatoryProperties {
	name: string;
	value: () => string;
}

const mandatoryProperties: MandatoryProperties[] = [
	{ name: "id", value: () => Date.now().toString() },
	{ name: "anki", value: () => "true" },
	{ name: "tags", value: () => "" },
];

const addMandatoryProperties: EditorCallback = async (_, ctx) => {
	const vault = ctx.app.vault;
	const file = ctx.app.workspace.getActiveFile();

	if (file == null) return;

	const content = await vault.read(file);
	const lines = content.split("\n");

	// property 섹션이 아예 없다면 추가
	if (!hasPropertySection(content)) {
		lines.unshift("---", "---");
	}

	const newLines: string[] = [];
	for (const mandatoryProperty of mandatoryProperties) {
		if (hasProperty(content, mandatoryProperty.name)) continue;
		newLines.push(
			`${mandatoryProperty.name}: ${mandatoryProperty.value()}`,
		);
	}

	let i = 0;
	while (lines[++i] !== "---") {
		continue;
	}

	vault.modify(
		file,
		[...lines.slice(0, i), ...newLines, ...lines.slice(i)].join("\n"),
	);
};

export { addMandatoryProperties };
