import type { ICharacterRepository } from '../../domain/ICharacterRepository';
import type { CharacterDTO } from '../dtos/CharacterDTO';
import { toCharacterDTO } from '../dtos/CharacterDTO';

export class GetCharacterById {
    constructor(private characterRepository: ICharacterRepository) { }

    async execute(id: string): Promise<CharacterDTO | null> {
        const character = await this.characterRepository.findById(id);
        if (!character) return null;
        return toCharacterDTO(character);
    }
}
