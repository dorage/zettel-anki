import { requestUrl } from "obsidian";
import { EditorCallback } from "types/obsidian";
import { hasProperty, obsidianToMarkdown } from "utils/markdown";
import { markdownToHTML } from "utils/remark";
import * as path from "path";

const addNote = async (note: {
	deck: string;
	fields: {
		id: string;
		front: string;
		back: string;
	};
	tags: string[];
	pictures?: string[];
	audios?: string[];
}) => {
	const req = requestUrl({
		url: "http://localhost:8765",
		contentType: "application/json",
		method: "post",
		body: JSON.stringify({
			action: "addNote",
			version: 6,
			params: {
				note: {
					deckName: note.deck,
					modelName: note.deck,
					fields: {
						id: note.fields.id,
						Front: note.fields.front,
						Back: note.fields.back,
					},
					options: {
						allowDuplicate: false,
						duplicateScope: "deck",
						duplicateScopeOptions: {
							deckName: "Default",
							checkChildren: false,
							checkAllModels: false,
						},
					},
					tags: note.tags,
					audio: [
						{
							url: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=猫&kana=ねこ",
							filename: "yomichan_ねこ_猫.mp3",
							skipHash: "7e2c2f954ef6051373ba916f000168dc",
							fields: ["Front"],
						},
					],
					picture: [
						{
							url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/A_black_cat_named_Tilly.jpg/220px-A_black_cat_named_Tilly.jpg",
							filename: "black_cat.jpg",
							skipHash: "8d6e4646dfae812bf39651b59d7429ce",
							fields: ["Back"],
						},
					],
				},
			},
		}),
	});

	const json = await req.json;
	console.log(json);
};

const exportToAnki: EditorCallback = async (editor, ctx) => {
	const files = ctx.app.vault.getFiles();

	for (const file of files) {
		const markdown = await ctx.app.vault.read(file);
		if (!hasProperty(markdown, "id")) continue;
		if (!hasProperty(markdown, "anki")) continue;

		const html = await markdownToHTML(obsidianToMarkdown(markdown));
		const rootPath = (ctx.app.vault.adapter as any).basePath;

		// TODO:
		// 양식에 맞는지 검사
		// --- 을 기준으로 front와 back 나누기
		// markdown content를 HTML로 변환하기
		// src들을 찾고, path로 변경
		// AnkiConnect 서버로 전송하기

		console.log(path.resolve(rootPath, "name.jopg"));
		console.log(path.resolve(rootPath, "../name.jopg"));
		console.log(html.value);

		await addNote({
			deck: "zettel-anki",
			fields: {
				id: "sd",
				front: "asdf",
				back: html.value.toString(),
			},
			tags: [],
		});
	}
};

export { exportToAnki };
