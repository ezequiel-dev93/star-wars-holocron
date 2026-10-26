import type { CharacterFilterParams } from "@core/characters/domain/ICharacterRepository";

/**
 * Character Entity — Core Domain Layer (Rich Domain Model - POO)
 * Encapsula tanto el estado como las reglas de negocio e invariantes de un personaje.
 */
export class Character {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly name: string,
    public readonly height: string,
    public readonly mass: string,
    public readonly hairColor: string,
    public readonly skinColor: string,
    public readonly eyeColor: string,
    public readonly birthYear: string,
    public readonly gender: string,
    public readonly homeworld: string,
    public readonly films: string[],
    public readonly species: string[],
    public readonly affiliations: string[],
    public readonly description?: string,
    public readonly avatarUrl?: string,
    public readonly isFavorite: boolean = false
  ) {}

  hasKnownHeight(): boolean {
    return this.height !== "unknown";
  }

  getHeightInCm(): number | null {
    if (!this.hasKnownHeight()) return null;
    return parseInt(this.height, 10);
  }

  isHuman(): boolean {
    return (
      this.species.length === 0 ||
      this.species.some((s) => s.toLowerCase() === "human")
    );
  }

  isMissingPortrait(): boolean {
    return !this.avatarUrl || this.avatarUrl.includes("placeholder");
  }

  matchesIdentifier(idOrSlug: string): boolean {
    const target = idOrSlug.trim().toLowerCase();
    return (
      this.id === target ||
      this.slug.toLowerCase() === target ||
      this.name.toLowerCase() === target
    );
  }

  matchesQuery(rawQuery: string): boolean {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      this.name.toLowerCase().includes(q) ||
      this.slug.toLowerCase().includes(q) ||
      this.homeworld.toLowerCase().includes(q) ||
      this.species.some((s) => s.toLowerCase().includes(q)) ||
      this.films.some((f) => f.toLowerCase().includes(q)) ||
      this.affiliations.some((a) => a.toLowerCase().includes(q)) ||
      Boolean(this.description && this.description.toLowerCase().includes(q))
    );
  }

  matchesCriteria(criteria: Omit<CharacterFilterParams, "page" | "pageSize">): boolean {
    if (criteria.query && !this.matchesQuery(criteria.query)) {
      return false;
    }

    if (criteria.species) {
      const sp = criteria.species.trim().toLowerCase();
      if (sp && !this.species.some((s) => s.toLowerCase().includes(sp))) {
        return false;
      }
    }

    if (criteria.planet) {
      const pl = criteria.planet.trim().toLowerCase();
      if (pl && !this.homeworld.toLowerCase().includes(pl)) {
        return false;
      }
    }

    if (criteria.gender) {
      const gd = criteria.gender.trim().toLowerCase();
      if (gd && this.gender.toLowerCase() !== gd) {
        return false;
      }
    }

    if (criteria.missingImage && !this.isMissingPortrait()) {
      return false;
    }

    return true;
  }
}
