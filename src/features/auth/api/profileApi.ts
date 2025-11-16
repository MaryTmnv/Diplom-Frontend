import { api } from '@/shared/lib/api/apiClient';
import { User } from '@/shared/types/user.types';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = {
  // Обновить профиль
  updateProfile: async (userId: string, data: UpdateProfileDto): Promise<User> => {
    return api.patch<User>(`/users/${userId}`, data);
  },

  // Изменить пароль
  changePassword: async (userId: string, data: ChangePasswordDto): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/users/${userId}/change-password`, data);
  },

  // Загрузить аватар
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};
