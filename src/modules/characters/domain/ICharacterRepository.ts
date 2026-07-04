import type { Character } from './Character';

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ICharacterRepository {
    findAll(page?: number): Promise<PaginatedResult<Character>>;
    findById(id: string): Promise<Character | null>;
    search(query: string): Promise<Character[]>;
}
