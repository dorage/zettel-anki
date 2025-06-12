interface MandatoryProperty {
	key: string;
	value: () => string;
}

const MandatoryPropertyKey: { [key in MandatoryPropertyKey]: string } = {
	id: "id",
	anki: "anki",
	tags: "tags",
	created: "created",
	modified: "modified",
};

type MandatoryPropertyKey = "id" | "anki" | "tags" | "created" | "modified";

const MandatoryProperty: { [key in MandatoryPropertyKey]: () => any } = {
	id: () => Date.now().toString(),
	anki: () => false,
	tags: () => [],
	created: () => new Date().toLocaleString(),
	modified: () => new Date().toLocaleString(),
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

export { MandatoryPropertyKey, mandatoryProperties, MandatoryProperty };
