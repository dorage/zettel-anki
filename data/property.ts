interface MandatoryProperty {
	key: string;
	value: () => string;
}

const MandatoryPropertyKey = {
	id: "id",
	anki: "anki",
	tags: "tags",
	created: "created",
	modified: "modified",
};

const mandatoryProperties: MandatoryProperty[] = [
	{ key: MandatoryPropertyKey.id, value: () => Date.now().toString() },
	{ key: MandatoryPropertyKey.anki, value: () => "false" },
	{ key: MandatoryPropertyKey.tags, value: () => "" },
	{
		key: MandatoryPropertyKey.created,
		value: () => new Date().toLocaleString(),
	},
	{
		key: MandatoryPropertyKey.modified,
		value: () => new Date().toLocaleString(),
	},
];

export { MandatoryPropertyKey, mandatoryProperties };
