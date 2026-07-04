export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'HttpError';
    }
}

export interface IHttpClient {
    get<T>(url: string): Promise<T>;
}
