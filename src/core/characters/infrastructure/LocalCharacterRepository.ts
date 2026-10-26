import type {
  CharacterFilterParams,
  ICharacterRepository,
  PaginatedResult,
} from "@core/characters/domain/ICharacterRepository";
import { Character } from "@core/characters/domain/Character";
import { rawCharactersData } from "@modules/characters/data";
import type { RawCharacterRecord } from "@modules/characters/types/character.types";

export class LocalCharacterRepository implements ICharacterRepository {
  private readonly characters: Character[];

  constructor() {
    this.characters = rawCharactersData.map((raw) => this.mapRawToDomain(raw));
  }

  private mapRawToDomain(raw: RawCharacterRecord): Character {
    const height = raw.physical_traits?.height_cm
      ? String(Math.round(raw.physical_traits.height_cm))
      : "unknown";
    const mass = raw.physical_traits?.mass_kg
      ? String(Math.round(raw.physical_traits.mass_kg))
      : "unknown";
    const hairColor = raw.physical_traits?.hair_color ?? "unknown";
    const skinColor = raw.physical_traits?.skin_color ?? "unknown";
    const eyeColor = raw.physical_traits?.eye_color ?? "unknown";
    const birthYear = raw.birth?.year ?? "unknown";
    const gender = raw.gender ?? "unknown";
    const homeworld = raw.planets?.[0] ?? "unknown";
    const films = raw.appearances ?? [];
    const species = raw.species ?? [];
    const affiliations = raw.affiliations ?? [];

    return new Character(
      String(raw.id),
      raw.slug,
      raw.name,
      height,
      mass,
      hairColor,
      skinColor,
      eyeColor,
      birthYear,
      gender,
      homeworld,
      films,
      species,
      affiliations,
      raw.description || undefined,
      raw.avatar_url || undefined,
      false
    );
  }

  async findAll(
    page: number = 1,
    pageSize: number = 24
  ): Promise<PaginatedResult<Character>> {
    return this.filter({ page, pageSize });
  }

  async findById(id: string): Promise<Character | null> {
    const found = this.characters.find((c) => c.matchesIdentifier(id));
    return found ?? null;
  }

  async search(query: string): Promise<Character[]> {
    return this.characters.filter((c) => c.matchesQuery(query));
  }

  async filter(
    params: CharacterFilterParams
  ): Promise<PaginatedResult<Character>> {
    const { page = 1, pageSize = 24, ...criteria } = params;

    const filtered = this.characters.filter((character) =>
      character.matchesCriteria(criteria)
    );

    const validPage = Math.max(1, page);
    const validSize = Math.max(1, Math.min(100, pageSize));
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / validSize));
    const start = (validPage - 1) * validSize;
    const end = start + validSize;
    const data = filtered.slice(start, end);

    return {
      data,
      total,
      page: validPage,
      totalPages,
      hasNext: validPage < totalPages,
      hasPrevious: validPage > 1,
    };
  }
}
