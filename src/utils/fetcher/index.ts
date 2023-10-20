import fetch, { Response } from "node-fetch";
import { KeyOf, StripNever } from "../types";
import { hasQuery } from "./utils";

export type Route<TData, TQuery = never, TBody = never> = [data: TData, query: TQuery, body: TBody];
export type AnyRoute = Route<unknown, unknown, unknown>;

export type GetQueryType<T extends AnyRoute> = T extends Route<any, infer TQuery, any> ? TQuery : never;
export type GetBodyType<T extends AnyRoute> = T extends Route<any, any, infer TBody> ? TBody : never;

export type RouteDefinitions = Record<string, Route<unknown, unknown, unknown>>;

export type RouteResponse<
    TRouteDef extends RouteDefinitions,
    TRouteName extends KeyOf<TRouteDef> | string,
> = TRouteName extends KeyOf<TRouteDef>
    ? TRouteDef[TRouteName] extends Route<infer TData, any, any>
        ? TData
        : any
    : any;

export type FetchOptions<
    TRouteDef extends RouteDefinitions,
    TRouteName extends KeyOf<TRouteDef> | string,
> = StripNever<{
    method: "GET" | "POST";
    query: GetQueryType<TRouteDef[TRouteName]>;
    body: GetBodyType<TRouteDef[TRouteName]>;
}>;

export class Fetcher<TRouteDef extends RouteDefinitions = never> {
    private static readonly fetcher: typeof fetch = fetch;

    private readonly baseUrl: string;

    public constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private buildUrl<TRouteName extends KeyOf<TRouteDef> | string>(
        routeName: TRouteName,
        options: FetchOptions<TRouteDef, TRouteName>,
    ): string {
        if (!hasQuery(options)) {
            return routeName;
        }

        let result: string = routeName;
        for (const queryKey of Object.keys(options.query)) {
            result = result.replaceAll(`{${queryKey}}`, options.query[queryKey].toString());
        }

        return result;
    }

    public async fetch<TRouteName extends KeyOf<TRouteDef> | string>(
        routeName: TRouteName,
        options: FetchOptions<TRouteDef, TRouteName>,
    ): Promise<Response> {
        const { method } = options;
        if (method === "GET" && "body" in options) {
            throw new Error("fetch cannot have body if fetch method is 'GET'.");
        }

        const url = `${this.baseUrl}${this.buildUrl(routeName, options)}`;
        return Fetcher.fetcher(url, {
            method,
        });
    }

    public async fetchJson<TRouteName extends KeyOf<TRouteDef> | string>(
        routeName: TRouteName,
        options: FetchOptions<TRouteDef, TRouteName>,
    ): Promise<RouteResponse<TRouteDef, TRouteName>> {
        const response = await this.fetch(routeName, options);

        return response.json();
    }
}
