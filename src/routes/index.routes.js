import { Router } from "express";
import { inngest } from "../inngest/client.js";
import { parseRepo } from "../service/github.js";

const routes = Router();

routes.post("/", async (req, res) => {
    const { repoUrl } = req.body;

    if (typeof repoUrl !== "string" || !repoUrl.trim()) {
        return res.status(400).json({ error: "repoUrl is required" });
    }

    const githubAccessToken = process.env.GITHUB_TOKEN;

    const { owner, repo, repokey } = parseRepo(repoUrl);

    const job = await inngest.send({
        name: "repo/index.requested",
        data: { repoUrl, owner, repo, repokey, githubAccessToken },
    });

    res.json(job);
});

export default routes;
