import type { ICharacterRepository } from '../../domain/ICharacterRepository';
import type { PaginatedCharactersDTO } from '../dtos/CharacterDTO';
import { toCharacterDTO } from '../dtos/CharacterDTO';

export class GetCharacters {
    constructor(private characterRepository: ICharacterRepository) { }

    async execute(page: number = 1): Promise<PaginatedCharactersDTO> {
        const result = await this.characterRepository.findAll(page);
        return {
            characters: result.data.map(toCharacterDTO),
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            hasNext: result.hasNext,
            hasPrevious: result.hasPrevious,
        };
    }
}
