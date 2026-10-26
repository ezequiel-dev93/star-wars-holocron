import { LocalCharacterRepository } from "@core/characters/infrastructure/LocalCharacterRepository";
import { GetCharacters } from "@core/characters/application/use-cases/GetCharacters";
import { GetCharacterById } from "@core/characters/application/use-cases/GetCharacterById";
import { toCharacterDTO } from "@core/characters/application/dtos/CharacterDTO";

export const characterRepository = new LocalCharacterRepository();

export const getCharactersUseCase = new GetCharacters(characterRepository);
export const getCharacterByIdUseCase = new GetCharacterById(characterRepository);

export { toCharacterDTO };
export type {
  CharacterDTO,
  PaginatedCharactersDTO,
} from "@core/characters/application/dtos/CharacterDTO";
export type {
  CharacterFilterParams,
  ICharacterRepository,
  PaginatedResult,
} from "@core/characters/domain/ICharacterRepository";
export { Character } from "@core/characters/domain/Character";
