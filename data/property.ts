const mandatoryPropertyKey = {
	id: "id",
	anki: "anki",
	tags: "tags",
	created: "created",
	modified: "modified",
};

const mandatoryPropertyKeys = Reflect.ownKeys(
	mandatoryPropertyKey,
) as (keyof typeof mandatoryPropertyKey)[];

const mandatoryProperty: {
	[key in (typeof mandatoryPropertyKey)[keyof typeof mandatoryPropertyKey]]: () => any;
} = {
	id: () => Date.now().toString(),
	anki: () => false,
	tags: () => [],
	created: () => new Date().toLocaleString(),
	modified: () => new Date().toLocaleString(),
};

export { mandatoryProperty, mandatoryPropertyKey, mandatoryPropertyKeys };
