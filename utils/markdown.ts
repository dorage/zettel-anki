// NOTE:
// property 규칙
// 1. 맨 첫번째 줄이 정확히 '---' 이어야 한다.
// 2. '---'로 닫혀야 하고, 그 사이에는 항상 다음 property 규칙이 적용된다
// 3. ^{name}[ ]*:[ ]*{value}*$
// 4. 특이사항으로는 값이 있는 property의 경우 콜론 뒤에 무조건 한 칸 이상의 띄어쓰는 규칙이 적용된다

const Regex = {
	// $1 - property section
	PropertySection: new RegExp(`^---\n(.*\n)*?---`),
	// $1 - key, $2 - value
	Property:
		/(?:^([\w\d _-]*)[ ]*[:][ ]*(?:\n(?:([ \-_\w\d\n]*$)*)|(?:(.*)$)))/gm,
	Content: new RegExp(`^---\n(?:.*\n)*?---\n((?:.*[\n]?)*)`, "m"),
	// $1 - Front, $2 - Back
	ContentFrontBack: new RegExp(`((?:.*\n)*)---\n((?:.*\n?)*)`),
};

// propertySection 만 반환
const extractPropertySection = (content: string): string | null => {
	return content.match(Regex.PropertySection)?.[0] ?? null;
};

const extractContent = (content: string): string | null => {
	return content.match(Regex.Content)?.[1] ?? null;
};

const hasPropertySection = (content: string): boolean => {
	return extractPropertySection(content) != null;
};

const hasProperty = (content: string, name: string): boolean => {
	if (!hasPropertySection) return false;
	const lines = content.split("\n");
	const re = new RegExp(`^${name}[ ]*:[ ]*.*$`, "m");

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];

		// property section 이 끝나면 나가기
		if (line === "---") break;

		if (line.match(re) != null) return true;
	}
	return false;
};

const ObsidianFormats: { [key in string]: [RegExp, string] } = {
	LineBreak: [/\n/g, "<br/>"],
	InternalImage: [/!\[\[(.*\.(?:png|jpg|gif|jpeg|webp))\]\]/g, `![]($1)`],
	InternalAudio: [/!\[\[(.*\.(?:mp3|ogg))\]\]/g, `[sound:$1]`],
	InternalLink: [/\[\[([^\]]+)\]\]/g, `'$1'`],
};

const extractReources = () => {};

const obsidianToMarkdown = (obsidianMd: string) => {
	return obsidianMd
		.replace(...ObsidianFormats.LineBreak)
		.replace(...ObsidianFormats.InternalImage)
		.replace(...ObsidianFormats.InternalAudio)
		.replace(...ObsidianFormats.InternalLink);
};

// property들을 오브젝트로 반환
const parseProperties = (propertySection: string) => {
	const properties = [];
	const matches = Array.from(propertySection.matchAll(Regex.Property));

	for (const match of matches) {
		properties.push({ key: match[1], value: match[2] ?? match[3] });
	}

	return properties;
};

// obsidian 문서를 Anki에 넣을 수 있도록 파싱
const parseContent = (content: string) => {
	const match = content.match(Regex.ContentFrontBack);
	if (match == null) return null;
	return { front: match[1], back: match[2] };
};

const isZettelAnkiFormat = (content: string): boolean => {
	return true;
};

export {
	extractPropertySection,
	extractContent,
	hasProperty,
	hasPropertySection,
	obsidianToMarkdown,
	parseProperties,
	parseContent,
};
