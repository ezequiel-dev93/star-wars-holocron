import { HttpError } from './IHttpClient';
import type { IHttpClient } from './IHttpClient';

export class FetchHttpClient implements IHttpClient {
    async get<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new HttpError(response.status, `HTTP Error: ${response.status} ${response.statusText}`);
        }
        return response.json() as Promise<T>;
    }
}
