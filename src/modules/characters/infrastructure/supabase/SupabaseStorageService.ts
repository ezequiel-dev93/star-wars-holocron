import type { IStorageService } from '@/modules/characters/domain/IStorageService';
import { supabaseClient } from '@/shared/supabase/supabaseClient';

export class SupabaseStorageService implements IStorageService {
  private readonly bucketName = 'avatars';
  constructor(private client = supabaseClient) { }
  async uploadFile(path: string, file: File | Blob): Promise<string> {
    const { data, error } = await this.client.storage.from(this.bucketName).upload(path, file, { cacheControl: '3600', upsert: true });
    if (error || !data) throw new Error('Could not upload file');
    return this.getPublicUrl(data.path);
  }
  getPublicUrl(path: string): string {
    const { data } = this.client.storage.from(this.bucketName).getPublicUrl(path);
    return data.publicUrl;
  }
  async deleteFile(path: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucketName).remove([path]);
    if (error) throw new Error('Could not delete file');
  }
}