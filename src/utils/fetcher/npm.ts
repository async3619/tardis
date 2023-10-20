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

interface PackageNotFound {
    error: "Not found";
}

type PackageResponse = PackageNotFound | PackageInformation;

interface NpmRouteDef extends RouteDefinitions {
    "/{packageName}": Route<PackageResponse, { packageName: string }>;
}

export const npmFetcher = new Fetcher<NpmRouteDef>("https://registry.npmjs.org");
