import type { Character } from "@core/characters/domain/Character";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CharacterFilterParams {
  query?: string;
  species?: string;
  planet?: string;
  gender?: string;
  missingImage?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ICharacterRepository {
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<Character>>;
  findById(id: string): Promise<Character | null>;
  search(query: string): Promise<Character[]>;
  filter(params: CharacterFilterParams): Promise<PaginatedResult<Character>>;
}
