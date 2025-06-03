import { EditorCallback } from "types/obsidian";
import { hasProperty } from "utils/markdown";

const exportToAnki: EditorCallback = async (editor, ctx) => {
	console.log(ctx.app.vault.getFiles().map((file) => file.name));
	const files = ctx.app.vault.getFiles();

	for (const file of files) {
		const content = await ctx.app.vault.read(file);
		if (!hasProperty(content, "id")) continue;
		if (!hasProperty(content, "anki")) continue;

		// TODO:
		// 양식에 맞는지 검사
		// --- 을 기준으로 front와 back 나누기
		// markdown content를 HTML로 변환하기
		// AnkiConnect 서버로 전송하기
	}
};

export { exportToAnki };
