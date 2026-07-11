import type { ICharacterRepository } from '@/modules/characters/domain/ICharacterRepository';
import type { CharacterDTO } from '@/modules/characters/application/dtos/CharacterDTO';
import { toCharacterDTO } from '@/modules/characters/application/dtos/CharacterDTO';

export class GetCharacterById {
    constructor(private characterRepository: ICharacterRepository) { }

    async execute(id: string): Promise<CharacterDTO | null> {
        const character = await this.characterRepository.findById(id);
        if (!character) return null;
        return toCharacterDTO(character);
    }
}
