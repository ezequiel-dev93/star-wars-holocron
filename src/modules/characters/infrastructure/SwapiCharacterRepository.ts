import { Character } from '@/modules/characters/domain/Character';
import type { ICharacterRepository, PaginatedResult } from '@/modules/characters/domain/ICharacterRepository';
import { SwapiClient } from '@/modules/characters/infrastructure/swapi';
import type { SwapiPerson } from '@/modules/characters/infrastructure/swapi';

export class SwapiCharacterRepository implements ICharacterRepository {
    private client: SwapiClient;

    constructor(client: SwapiClient) {
        this.client = client;
    }

    private extractIdFromUrl(url: string): string {
        const matches = url.match(/\/(\d+)\/$/);
        return matches ? matches[1] : '0';
    }

    private mapToCharacter(data: SwapiPerson): Character {
        return new Character(
            this.extractIdFromUrl(data.url),
            data.name,
            data.height,
            data.mass,
            data.hair_color,
            data.skin_color,
            data.eye_color,
            data.birth_year,
            data.gender,
            data.homeworld,
            data.films,
            data.species,
            data.vehicles,
            data.starships
        );
    }

    async findAll(page: number = 1): Promise<PaginatedResult<Character>> {
        const response = await this.client.getPeople(page);
        const characters = response.results.map(((person) => this.mapToCharacter(person)));
        const pageSize = 10;
        const totalPages = Math.ceil(response.count / pageSize);
        return {
            data: characters,
            total: response.count,
            page,
            totalPages,
            hasNext: response.next !== null,
            hasPrevious: response.previous !== null,
        };
    }

    async findById(id: string): Promise<Character | null> {
        const person = await this.client.getPersonById(id);
        if (!person) return null;
        return this.mapToCharacter(person);
    }

    async search(query: string): Promise<Character[]> {
        const response = await this.client.searchPeople(query);
        return response.results.map((person) => this.mapToCharacter(person));
    }
}
