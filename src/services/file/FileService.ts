import { apiService } from '../ApiService';

class FileService {
  /**
   * 이미지 업로드 API
   */
  public async uploadImage(bucketKind: string, uri: string, filename: string, type: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);

    const response = await apiService.post<string>(`/api/v1/storage/${bucketKind}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data) => data, 
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '이미지 업로드에 실패했습니다.');
    }
    
    return response.data;
  }
}

export const fileService = new FileService();
