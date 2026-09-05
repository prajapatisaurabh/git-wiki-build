import { inngest } from "../client.js";
import { parseRepo, getRepoFiles } from "../../service/github.js";
import { chunkFiles } from "../../service/chunker.js";
import { storeDocuments } from "../../service/vectorStore.js";

export const indexRepo = inngest.createFunction(
    { id: "index-repo", name: "Index Repo", triggers: [{ event: "repo/index.requested" }] },
    async ({ event, step }) => {
        const { repoUrl } = event.data;

        const { owner, repo, repokey } = parseRepo(repoUrl);

        const files = await step.run("Get Repo Files", async () => {
            return await getRepoFiles(owner, repo);
        });

        const documents = await step.run("Chunk Files", async () => {
            return await chunkFiles(owner, repo, files);
        });

        await step.run("Upsert to Pinecone", async () => {
            await storeDocuments(documents);
        });

        return { repokey, fileCount: files.length, chunkCount: documents.length };
    }
);
