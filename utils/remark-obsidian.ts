/**
 * @typedef {import('mdast').Root} Root
 */
import { findAndReplace } from "mdast-util-find-and-replace";

const REGEX = {
	LineBreak: new RegExp(`\n`, "mg"),
	// EmbedLink: new RegExp(`!\[\[([^\]]+)\]\]`, "g"),
	InternalLink: /!\[\[([^\]]+)\]\]/g,
};

/**
 *
 *
 * @returns
 *   Transform.
 */
export default function remarkObsidian() {
	/**
	 * Transform.
	 *
	 * @param {Root} tree
	 *   Tree.
	 * @returns {undefined}
	 *   Nothing.
	 */
	return function (tree) {
		findAndReplace(tree, [
			[
				REGEX.LineBreak,
				function () {
					return "<br/>";
				},
			],
			[
				REGEX.InternalLink,
				function (_, $1) {
					return `![](${$1})`;
				},
			],
		]);
	};
}
