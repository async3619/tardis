import { Octokit } from "@octokit/rest";

import { npmFetcher } from "@utils/fetcher/npm";
import { Nullable } from "@utils/types";

export interface ReleaseNote {
    tagName: string;
    title: Nullable<string>;
    content: Nullable<string>;
}

export class Package {
    private static readonly instances = new Map<string, Package>();
    private static readonly githubClient = new Octokit();

    public static async fromName(packageName: string) {
        let instance = Package.instances.get(packageName);
        if (instance) {
            return instance;
        }

        const data = await npmFetcher.fetchJson("/{packageName}", {
            method: "GET",
            query: { packageName },
        });

        const latestVersion = data["dist-tags"].latest;
        if (!latestVersion) {
            throw new Error("Failed to get latest version tag.");
        }

        const { repository } = data.versions[latestVersion];
        if (!repository || repository.type !== "git") {
            throw new Error("Failed to get package repository information.");
        }

        const repositoryUrl = new URL(repository.url);
        let ownerRepo = repositoryUrl.pathname;
        if (ownerRepo.startsWith("/")) {
            ownerRepo = ownerRepo.slice(1);
        }

        if (ownerRepo.endsWith(".git")) {
            ownerRepo = ownerRepo.slice(0, ownerRepo.length - 4);
        }

        const [owner, repo] = ownerRepo.split("/");

        instance = new Package(packageName, owner, repo);
        Package.instances.set(packageName, instance);

        return instance;
    }

    private readonly packageName: string;
    private readonly owner: string;
    private readonly repo: string;

    private constructor(packageName: string, owner: string, repo: string) {
        this.packageName = packageName;
        this.owner = owner;
        this.repo = repo;
    }

    public async getReleaseNotes(): Promise<ReleaseNote[]> {
        const result: ReleaseNote[] = [];
        let page = 1;

        while (true) {
            const response = await Package.githubClient.repos.listReleases({
                owner: this.owner,
                repo: this.repo,
                per_page: 30,
                page,
            });

            result.push(
                ...response.data.map(item => ({
                    tagName: item.tag_name,
                    title: item.name,
                    content: item.body,
                })),
            );

            if (response.data.length < 30) {
                break;
            }

            page++;
        }

        return result;
    }
}
