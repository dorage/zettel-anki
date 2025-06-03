// NOTE:
// property 규칙
// 1. 맨 첫번째 줄이 정확히 '---' 이어야 한다.
// 2. '---'로 닫혀야 하고, 그 사이에는 항상 다음 property 규칙이 적용된다
// 3. ^{name}[ ]*:[ ]*{value}*$
// 4. 특이사항으로는 값이 있는 property의 경우 콜론 뒤에 무조건 한 칸 이상의 띄어쓰는 규칙이 적용된다
const hasPropertySection = (content: string): boolean => {
	const match = content.match(
		/(?:---)\n(?:(?:[^ :\n]+)[ ]*:[ ]+(?:[^ :\n]+)[\n])*/gm,
	);

	if (match == null) return false;
	const lines = content.split("\n");

	return lines[0] === "---";
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

export { hasProperty, hasPropertySection };
