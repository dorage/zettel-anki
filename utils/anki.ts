import { requestUrl } from "obsidian";

type AnkiFailedResponse = {
	result: null;
	error: string;
};

type AnkiSuccessResponse<T> = {
	result: T;
	error: null;
};

const ankiClient = async <T>(body: object) => {
	const req = await requestUrl({
		url: "http://localhost:8765",
		contentType: "application/json",
		method: "post",
		body: JSON.stringify(body),
	});

	const res = req.json as AnkiSuccessResponse<T> | AnkiFailedResponse;

	if (res.error != null) {
		throw new Error(res.error);
	}

	return res.result;
};

const storeMediaFile = async (
	params:
		| { filename: string; path: string }
		| { filename: string; url: string },
) => {
	try {
		const res = await ankiClient<string>({
			action: "storeMediaFile",
			version: 6,
			params,
		});
		return res;
	} catch (err) {
		console.error(err);
	}
};

const findNote = async (deck: string, id: string) => {
	try {
		const res = await ankiClient<number[]>({
			action: "findNotes",
			version: 6,
			params: {
				query: `deck:${deck} ${id}`,
			},
		});

		return res.length > 0;
	} catch (err) {
		console.error(err);
	}
	return false;
};

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
	const res = ankiClient<number>({
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
						checkChildren: true,
						checkAllModels: true,
					},
				},
				tags: note.tags,
			},
		},
	});

	return res;
};

export { storeMediaFile, addNote, findNote };
