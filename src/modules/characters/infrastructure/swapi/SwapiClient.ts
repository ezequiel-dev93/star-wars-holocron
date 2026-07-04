import type { SwapiPeopleResponse, SwapiPerson } from './types';
import type { IHttpClient } from '@/shared/http/IHttpClient';
import { HttpError } from '@/shared/http/IHttpClient';

const SWAPI_BASE_URL = 'https://swapi.dev/api';

export class SwapiClient {
    private baseUrl: string;
    private httpClient: IHttpClient;

    constructor(httpClient: IHttpClient, baseUrl: string = SWAPI_BASE_URL) {
        this.httpClient = httpClient;
        this.baseUrl = baseUrl;
    }

    async getPeople(page: number = 1): Promise<SwapiPeopleResponse> {
        return this.httpClient.get<SwapiPeopleResponse>(`${this.baseUrl}/people/?page=${page}`);
    }

    async getPersonById(id: string): Promise<SwapiPerson | null> {
        try {
            return await this.httpClient.get<SwapiPerson>(`${this.baseUrl}/people/${id}/`);
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) return null;
            console.error(`Error fetching person ${id}:`, error);
            return null;
        }
    }

    async searchPeople(query: string): Promise<SwapiPeopleResponse> {
        return this.httpClient.get<SwapiPeopleResponse>(
            `${this.baseUrl}/people/?search=${encodeURIComponent(query)}`
        );
    }
}
