import { t as toCharacterDTO } from './SwapiCharacterRepository_Bgg8SXMx.mjs';

class GetCharacters {
  constructor(characterRepository) {
    this.characterRepository = characterRepository;
  }
  async execute(page = 1) {
    const result = await this.characterRepository.findAll(page);
    return {
      characters: result.data.map(toCharacterDTO),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.hasNext,
      hasPrevious: result.hasPrevious
    };
  }
}

export { GetCharacters as G };
