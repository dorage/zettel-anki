import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import { unified } from "unified";

const processor = unified()
	.use(remarkParse, {})
	.use(remarkGfm, {})
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeStringify, { allowDangerousHtml: true });

const markdownToHTML = (content: string) => {
	return processor.process(content);
};

export { markdownToHTML };
