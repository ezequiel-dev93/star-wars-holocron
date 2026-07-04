import { supabaseClient } from '@/shared/supabase/supabaseClient';

export interface CustomCharacterData {
  description?: string;
  avatarUrl?: string;
  isFavorite: boolean;
}

export class SupabaseCharacterRepository {
  constructor(private client = supabaseClient) {}
  async getCustomData(swapiId: string): Promise<CustomCharacterData> {
    try {
      const { data, error } = await this.client.from('characters_custom_data').select('*').eq('swapi_id', swapiId).single();
      if (error || !data) return { isFavorite: false };
      return { description: data.description, avatarUrl: data.avatar_url, isFavorite: data.is_favorite || false };
    } catch { return { isFavorite: false }; }
  }
}
