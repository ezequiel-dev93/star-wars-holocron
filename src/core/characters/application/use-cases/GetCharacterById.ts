import type { ICharacterRepository } from "@core/characters/domain/ICharacterRepository";
import type { CharacterDTO } from "@core/characters/application/dtos/CharacterDTO";
import { toCharacterDTO } from "@core/characters/application/dtos/CharacterDTO";

export class GetCharacterById {
  constructor(private characterRepository: ICharacterRepository) {}

  async execute(id: string): Promise<CharacterDTO | null> {
    const character = await this.characterRepository.findById(id);
    if (!character) return null;
    return toCharacterDTO(character);
  }
}
