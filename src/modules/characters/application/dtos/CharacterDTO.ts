import type { Character } from '@/modules/characters/domain/Character';

export interface CharacterDTO {
    id: string;
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
    return {
        id: character.id,
        name: character.name,
        height: character.height,
        mass: character.mass,
        hairColor: character.hairColor,
        skinColor: character.skinColor,
        eyeColor: character.eyeColor,
        birthYear: character.birthYear,
        gender: character.gender,
        homeworldUrl: character.homeworld,
        imageUrl: `https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg`,
        description: character.description,
        avatarUrl: character.avatarUrl,
        isFavorite: character.isFavorite ?? false,
    };
}
