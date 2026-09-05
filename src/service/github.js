import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const SKIP_DIRS = ["node_modules", ".git", ".github", ".vscode", "dist",
    "test", "tests", "docs", "doc", "documentation", "examples", "example", "samples", "sample"];


const SKIP_EXTENSIONS = [".md", ".markdown", ".txt", ".json", ".yml", ".yaml",
    ".xml", ".csv", ".tsv", ".ini", ".conf", ".cfg", ".log", ".bak", ".tmp"];


function shouldSkipFile(path, size) {
    const parts = path.split("/");
    const filename = parts[parts.length - 1];

    if (parts.some(part => SKIP_DIRS.includes(part))) return true;
    if (size > 1024 * 1024) return true; // Skip files larger than 1MB

    const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")).toLowerCase() : "";

    if (SKIP_EXTENSIONS.includes(ext)) return true;

    if (filename.endsWith(".min.js") || filename.endsWith(".min.css")) return true;

    return false;
}

export async function getRepoFiles(owner, repo, path = "") {
    const files = [];
    const response = await octokit.repos.getContent({
        owner,
        repo,
        path
    });

    const items = Array.isArray(response.data) ? response.data : [response.data];

    for (const item of items) {
        if (item.type === "file") {
            if (!shouldSkipFile(item.path, item.size)) {
                files.push(item);
            }
        } else if (item.type === "dir") {
            const dirName = item.path.split("/").pop();
            if (SKIP_DIRS.includes(dirName)) continue;
            const subFiles = await getRepoFiles(owner, repo, item.path);
            files.push(...subFiles);
        }
    }

    return files;
}


export function parseRepo(input) {
    const clean = input
        .replace("https://github.com/", "")
        .replace("http://github.com/", "")
        .replace(/\.git$/, "");

    const [owner, repo] = clean.split("/");
    return { owner, repo, repokey: `${owner}/${repo}` };
}