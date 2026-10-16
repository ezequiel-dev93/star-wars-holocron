import type { ICharacterRepository, PaginatedResult } from '@/modules/characters/domain/ICharacterRepository';
import { Character } from '@/modules/characters/domain/Character';
import rawCharacters from '@/data/characters.json';

interface RawCharacter {
    id: number;
    slug: string;
    name: string;
    gender?: string | null;
    species?: string[];
    physical_traits?: {
        height_cm?: number | null;
        mass_kg?: number | null;
        hair_color?: string | null;
        eye_color?: string | null;
        skin_color?: string | null;
    };
    planets?: string[];
    affiliations?: string[];
    appearances?: string[];
    description?: string;
    avatar_url?: string | null;
    birth?: {
        year?: string | null;
    };
}

export class LocalCharacterRepository implements ICharacterRepository {
    private characters: Character[];

    constructor() {
        this.characters = (rawCharacters as RawCharacter[]).map((raw) => {
            const height = raw.physical_traits?.height_cm
                ? String(Math.round(raw.physical_traits.height_cm))
                : 'unknown';
            const mass = raw.physical_traits?.mass_kg
                ? String(Math.round(raw.physical_traits.mass_kg))
                : 'unknown';
            const hairColor = raw.physical_traits?.hair_color ?? 'unknown';
            const skinColor = raw.physical_traits?.skin_color ?? 'unknown';
            const eyeColor = raw.physical_traits?.eye_color ?? 'unknown';
            const birthYear = raw.birth?.year ?? 'unknown';
            const gender = raw.gender ?? 'unknown';
            const homeworld = raw.planets?.[0] ?? 'unknown';
            const films = raw.appearances ?? [];
            const species = raw.species ?? [];
            const vehicles: string[] = [];
            const starships: string[] = [];

            return new Character(
                String(raw.id),
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
                vehicles,
                starships,
                raw.description || undefined,
                raw.avatar_url || undefined,
                false
            );
        });
    }

    async findAll(page: number = 1, pageSize: number = 20): Promise<PaginatedResult<Character>> {
        const validPage = Math.max(1, page);
        const total = this.characters.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (validPage - 1) * pageSize;
        const end = start + pageSize;
        const data = this.characters.slice(start, end);

        return {
            data,
            total,
            page: validPage,
            totalPages,
            hasNext: validPage < totalPages,
            hasPrevious: validPage > 1,
        };
    }

    async findById(id: string): Promise<Character | null> {
        const found = this.characters.find(
            (c) => c.id === id || c.name.toLowerCase() === id.toLowerCase()
        );
        return found ?? null;
    }

    async search(query: string): Promise<Character[]> {
        const q = query.trim().toLowerCase();
        if (!q) return this.characters;
        return this.characters.filter((c) =>
            c.name.toLowerCase().includes(q) ||
            c.species.some((s) => s.toLowerCase().includes(q)) ||
            (c.description && c.description.toLowerCase().includes(q))
        );
    }
}
