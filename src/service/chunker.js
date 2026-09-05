import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getFileContent } from "./github.js";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

export async function chunkFiles(owner, repo, files) {
    const documents = [];

    for (const file of files) {
        const content = await getFileContent(owner, repo, file.path);
        const chunks = await splitter.splitText(content);

        chunks.forEach((chunk, index) => {
            documents.push({
                pageContent: chunk,
                metadata: {
                    repo: `${owner}/${repo}`,
                    source: file.path,
                    chunkIndex: index,
                },
            });
        });
    }

    return documents;
}
