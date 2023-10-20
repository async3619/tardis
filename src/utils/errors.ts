export class PackageNotFoundError extends Error {
    public constructor(packageName: string) {
        super(`Provided package with name '${packageName}' is not found in registry.`);
    }
}
