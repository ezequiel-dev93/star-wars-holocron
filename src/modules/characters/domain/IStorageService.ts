export interface IStorageService {
  uploadFile(path: string, file: File | Blob): Promise<string>;
  getPublicUrl(path: string): string;
  deleteFile(path: string): Promise<void>;
}