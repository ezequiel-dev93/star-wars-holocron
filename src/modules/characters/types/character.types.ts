import type { CharacterDTO } from "@core/characters/application/dtos/CharacterDTO";

export interface RawCharacterRecord {
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

export type { CharacterDTO };
