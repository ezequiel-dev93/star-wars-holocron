import { FetchHttpClient } from '@/shared/http/FetchHttpClient';
import { SwapiClient } from '@/modules/characters/infrastructure/swapi';
import { SwapiCharacterRepository } from '@/modules/characters/infrastructure/SwapiCharacterRepository';
import { GetCharacters } from '@/modules/characters/application/use-cases/GetCharacters';
import { GetCharacterById } from '@/modules/characters/application/use-cases/GetCharacterById';

const httpClient = new FetchHttpClient();
const swapiClient = new SwapiClient(httpClient);
export const characterRepository = new SwapiCharacterRepository(swapiClient);

export const getCharactersUseCase = new GetCharacters(characterRepository);
export const getCharacterByIdUseCase = new GetCharacterById(characterRepository);
