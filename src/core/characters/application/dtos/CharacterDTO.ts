import type { Character } from "@core/characters/domain/Character";

export interface CharacterDTO {
  id: string;
  slug: string;
  name: string;
  height: string;
  mass: string;
  hairColor: string;
  skinColor: string;
  eyeColor: string;
  birthYear: string;
  gender: string;
  homeworldUrl: string;
  imageUrl: string;
  species: string[];
  affiliations: string[];
  films: string[];
  description?: string;
  avatarUrl?: string;
  isFavorite: boolean;
}

export interface PaginatedCharactersDTO {
  characters: CharacterDTO[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function toCharacterDTO(character: Character): CharacterDTO {
  const localImage = character.avatarUrl || "/images/characters/placeholder.svg";

  return {
    id: character.id,
    slug: character.slug,
    name: character.name,
    height: character.height,
    mass: character.mass,
    hairColor: character.hairColor,
    skinColor: character.skinColor,
    eyeColor: character.eyeColor,
    birthYear: character.birthYear,
    gender: character.gender,
    homeworldUrl: character.homeworld,
    imageUrl: localImage,
    species: character.species,
    affiliations: character.affiliations,
    films: character.films,
    description: character.description,
    avatarUrl: character.avatarUrl,
    isFavorite: character.isFavorite ?? false,
  };
}
