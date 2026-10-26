import type {
  CharacterFilterParams,
  ICharacterRepository,
} from "@core/characters/domain/ICharacterRepository";
import type { PaginatedCharactersDTO } from "@core/characters/application/dtos/CharacterDTO";
import { toCharacterDTO } from "@core/characters/application/dtos/CharacterDTO";

/**
 * Use Case: GetCharacters
 * Orquesta la consulta paginada y filtrada de personajes a través de la abstracción ICharacterRepository.
 */
export class GetCharacters {
  constructor(private readonly characterRepository: ICharacterRepository) {}

  async execute(
    paramsOrPage: CharacterFilterParams | number = 1,
    pageSize: number = 24
  ): Promise<PaginatedCharactersDTO> {
    const criteria: CharacterFilterParams =
      typeof paramsOrPage === "number"
        ? { page: paramsOrPage, pageSize }
        : paramsOrPage;

    const result = await this.characterRepository.filter(criteria);

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
