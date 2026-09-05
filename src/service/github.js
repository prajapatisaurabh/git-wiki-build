import { octokit } from "@octokit/rest";

const SKIP_DIRS = ["node_modules", ".git", ".github", ".vscode", "dist",
    "src", "test", "tests", "docs", "doc", "documentation", "examples", "example", "samples", "sample"];


const SKIP_EXTENSIONS = [".md", ".markdown", ".txt", ".json", ".yml", ".yaml",
    ".xml", ".csv", ".tsv", ".ini", ".conf", ".cfg", ".log", ".bak", ".tmp"];


function shouldSkipFile(path, size) {
    const parts = path.split("/");
    const filename = parts[parts.length - 1];

    if (parts.some(part => SKIP_DIRS.includes(part))) return true;
    if (SKIP_EXTENSIONS.has(filename.substring(filename.lastIndexOf(".")))) return true;
    if (size > 1024 * 1024) return true; // Skip files larger than 1MB

    const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".") + 1).toLowerCase() : "";

    if (SKIP_EXTENSIONS.has(ext)) return true;

    if (filename.endsWith(".min.js") || filename.endsWith(".min.css")) return true;

    return false;
}

async function getRepoFiles(owner, repo, path = "") {
    const files = [];
    const response = await octokit.repos.getContent({
        owner,
        repo,
        path
    });

    for (const item of response.data) {
        if (item.type === "file") {
            if (!shouldSkipFile(item.path, item.size)) {
                files.push(item);
            }
        } else if (item.type === "dir") {
            const subFiles = await getRepoFiles(owner, repo, item.path);
            files.push(...subFiles);
        }
    }

    return files;
}

export { getRepoFiles };    