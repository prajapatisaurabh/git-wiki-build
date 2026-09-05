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

        const chunkCount = await step.run("Chunk And Store", async () => {
            const documents = await chunkFiles(owner, repo, files);
            await storeDocuments(documents);
            return documents.length;
        });

        return { repokey, fileCount: files.length, chunkCount };
    }
);
