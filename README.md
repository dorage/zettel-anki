# Zettel-Anki

[\[README-English\]](./doc/README-en.md)

[Obsidian](https://obsidian.md)으로 작성된 Zettelkasten 노트를 [Anki](https://apps.ankiweb.net/)로 가져오는 과정을 자동화하는 플러그인입니다.

## 사전 요구 사항

- **AnkiConnect**: 이 플러그인을 사용하려면 Anki 데스크톱 애플리케이션에 [AnkiConnect](https://ankiweb.net/shared/info/2055492159) 애드온이 설치되어 있어야 합니다.

## 주요 기능

- **자동 `modified` 타임스탬프**: 노트가 변경될 때마다 `modified` frontmatter 속성을 자동으로 업데이트합니다. 이를 통해 노트가 마지막으로 업데이트된 시점을 추적할 수 있습니다.
- **필수 속성 추가**: 노트에 필요한 frontmatter 속성(`id`, `anki`, `modified`)을 쉽게 추가할 수 있는 명령입니다. 이를 통해 노트를 내보낼 준비를 할 수 있습니다.
- **Anki로 내보내기**: 노트와 관련 리소스(예: 이미지)를 Anki로 내보내는 명령입니다.
    - 플러그인은 노트의 frontmatter에서 `anki: true`와 `id` 속성을 찾아 노트를 내보낼지 여부를 결정합니다.
    - 노트의 마크다운 콘텐츠를 Anki 카드의 앞면과 뒷면을 위해 HTML로 변환합니다.
    - 중복을 방지하기 위해 새 노트를 만들기 전에 동일한 `id`를 가진 노트가 Anki에 이미 존재하는지 확인합니다.
    - 이미지와 같은 참조된 리소스도 Anki에 미디어 파일로 업로드 및 저장됩니다.

## 사용 방법

1.  **플러그인을 설치합니다**.
2.  Obsidian에서 명령어 팔레트를 엽니다.
3.  내보내려는 노트에서 **"Add mandatory properties"** 명령을 실행합니다. 그러면 다음과 같은 속성이 frontmatter에 추가됩니다:
    ```yaml
    ---
    id: <unique_id>
    anki: false
    modified: <current_timestamp>
    ---
    ```
4.  해당 노트의 내보내기를 활성화하려면 `anki` 속성을 `true`로 변경합니다.
    ```yaml
    ---
    id: <unique_id>
    anki: true
    modified: <current_timestamp>
    ---
    ```
5.  노트의 내용은 `---` 구분 기호로 구성되어야 합니다. 구분 기호 앞의 내용은 Anki 카드의 앞면이 되고, 뒤의 내용은 뒷면이 됩니다.
6.  **"Export to Anki"** 명령을 실행하여 모든 해당 노트를 "zettel-anki"라는 이름의 Anki 덱으로 내보냅니다.
