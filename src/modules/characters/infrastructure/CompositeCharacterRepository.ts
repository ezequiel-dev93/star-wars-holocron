import type { ICharacterRepository, PaginatedResult } from '../domain/ICharacterRepository';
import { Character } from '../domain/Character';
import type { SupabaseCharacterRepository } from './supabase/SupabaseCharacterRepository';

export class CompositeCharacterRepository implements ICharacterRepository {
    constructor(
        private swapiRepo: ICharacterRepository,
        private supabaseRepo: SupabaseCharacterRepository
    ) { }

    private async enrichCharacter(character: Character): Promise<Character> {
        const customData = await this.supabaseRepo.getCustomData(character.id);
        return new Character(
            character.id, character.name, character.height, character.mass, character.hairColor,
            character.skinColor, character.eyeColor, character.birthYear, character.gender, character.homeworld,
            character.films, character.species, character.vehicles, character.starships,
            customData.description, customData.avatarUrl, customData.isFavorite
        );
    }

    async findAll(page?: number): Promise<PaginatedResult<Character>> {
        const result = await this.swapiRepo.findAll(page);
        const enrichedCharacters = await Promise.all(result.data.map(char => this.enrichCharacter(char)));
        return { ...result, data: enrichedCharacters };
    }

    async findById(id: string): Promise<Character | null> {
        const swapiCharacter = await this.swapiRepo.findById(id);
        if (!swapiCharacter) return null;
        return this.enrichCharacter(swapiCharacter);
    }

    async search(query: string): Promise<Character[]> {
        const results = await this.swapiRepo.search(query);
        return Promise.all(results.map(char => this.enrichCharacter(char)));
    }
}
