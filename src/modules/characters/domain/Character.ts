/*
 - Character Entity - Domain Layer
 - Representa un personaje del universo Star Wars
*/
export class Character {
    constructor(
        public readonly id: string,
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
        public readonly vehicles: string[],
        public readonly starships: string[],
        public readonly description?: string,
        public readonly avatarUrl?: string,
        public readonly isFavorite: boolean = false
    ) { }

    hasKnownHeight(): boolean {
        return this.height !== 'unknown';
    }

    getHeightInCm(): number | null {
        if (!this.hasKnownHeight()) return null;
        return parseInt(this.height, 10);
    }

    isHuman(): boolean {
        return this.species.length === 0;
    }
}
