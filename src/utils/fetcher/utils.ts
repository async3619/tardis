export type HavingQuery = {
    [key: string]: unknown;
    query: Record<string, string | number>;
};

export function hasQuery(options: unknown): options is HavingQuery {
    if (!options) {
        return false;
    }

    if (Array.isArray(options)) {
        return false;
    }

    if (typeof options !== "object") {
        return false;
    }

    return "query" in options;
}
