import { api } from '@/shared/lib/api/apiClient';
import type { UserType } from '@/shared/types/user.types';

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
  /**
   * Обновить профиль пользователя
   */
  updateProfile: async (userId: string, data: UpdateProfileDto): Promise<UserType> => {
    const response = await api.patch<UserType>(`/users/${userId}`, data);
    return response.data; // ← Возвращаем data, а не весь response!
  },

  /**
   * Изменить пароль
   */
  changePassword: async (userId: string, data: ChangePasswordDto): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/users/${userId}/change-password`, data);
    return response.data; // ← Возвращаем data, а не весь response!
  },

  /**
   * Получить профиль текущего пользователя
   */
  getMe: async (): Promise<UserType> => {
    const response = await api.get<UserType>('/users/me');
    return response.data;
  },

  /**
   * Загрузить аватар
   */
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<{ url: string }>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Удалить аватар
   */
  deleteAvatar: async (): Promise<void> => {
    await api.delete('/users/avatar');
  },
};
