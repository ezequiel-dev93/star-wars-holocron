import { LocalCharacterRepository } from '@/modules/characters/infrastructure/LocalCharacterRepository';
import { GetCharacters } from '@/modules/characters/application/use-cases/GetCharacters';
import { GetCharacterById } from '@/modules/characters/application/use-cases/GetCharacterById';

export const characterRepository = new LocalCharacterRepository();

export const getCharactersUseCase = new GetCharacters(characterRepository);
export const getCharacterByIdUseCase = new GetCharacterById(characterRepository);

