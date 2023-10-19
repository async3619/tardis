import { Fetcher, Route, RouteDefinitions } from "./index";

interface PackageInformation {
    "dist-tags": {
        latest?: string;
    };
    versions: {
        [versionName: string]: {
            repository?: { type: string; url: string };
        };
    };
}

interface NpmRouteDef extends RouteDefinitions {
    "/{packageName}": Route<PackageInformation, { packageName: string }>;
}

export const npmFetcher = new Fetcher<NpmRouteDef>("https://registry.npmjs.org");
