export class HttpError extends Error {
    public readonly status: number;
    public readonly statusText: string;

    public constructor(status: number, statusText: string) {
        super(`${status} ${statusText}`);

        this.status = status;
        this.statusText = statusText;
    }
}

export function getErrorMessage(error: unknown): string {
    if (typeof error === "string") {
        return error;
    }

    if (error instanceof Error) {
        if ("cause" in error) {
            return getErrorMessage(error.cause);
        }

        return error.message;
    }

    return "Unknown error";
}
