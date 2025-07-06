# Zettel-Anki

This is a plugin for [Obsidian](https://obsidian.md) that automates the process of importing Zettelkasten notes written in Obsidian into [Anki](https://apps.ankiweb.net/).

## Prerequisite

- **AnkiConnect**: This plugin requires the [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on to be installed in your Anki desktop application.

## Features

- **Automatic `modified` timestamp**: Automatically updates a `modified` frontmatter property whenever a note is changed. This helps in tracking when a note was last updated.
- **Add Mandatory Properties**: A command to easily add the necessary frontmatter properties (`id`, `anki`, `modified`) to your notes. This ensures your notes are ready for export.
- **Export to Anki**: A command that exports your notes and associated resources (e.g., images) to Anki.
    - The plugin looks for `anki: true` and an `id` property in the note's frontmatter to determine if a note should be exported.
    - It converts the Markdown content of your notes into HTML for the front and back of the Anki cards.
    - To prevent duplicates, it checks if a note with the same `id` already exists in Anki before creating a new one.
    - Any referenced resources like images are also uploaded and stored as media files in Anki.

## How to Use

1.  **Install the plugin**.
2.  Open the command palette in Obsidian.
3.  Run the **"Add mandatory properties"** command on a note you want to export. This will add the following properties to the frontmatter:
    ```yaml
    ---
    id: <unique_id>
    anki: false
    modified: <current_timestamp>
    ---
    ```
4.  Change the `anki` property to `true` to enable exporting for that note.
    ```yaml
    ---
    id: <unique_id>
    anki: true
    modified: <current_timestamp>
    ---
    ```
5.  The content of your note should be structured with a `---` separator. The content before the separator will be the front of the Anki card, and the content after will be the back.
6.  Run the **"Export to Anki"** command to export all eligible notes to your Anki deck named "zettel-anki".
