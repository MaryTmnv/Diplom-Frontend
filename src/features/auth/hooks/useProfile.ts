import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileApi, UpdateProfileDto, ChangePasswordDto } from '../api/profileApi';
import { useAuthStore } from '../store/authStore';
import { queryKeys } from '@/shared/lib/api/queryClient';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => profileApi.updateProfile(user!.id, data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      toast.success('Профиль обновлён');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка обновления профиля';
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ChangePasswordDto }) =>
      profileApi.changePassword(userId, data),
    onSuccess: () => {
      toast.success('Пароль успешно изменён. Войдите заново.');
      // Разлогиниваем пользователя
      setTimeout(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
      }, 2000);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка смены пароля';
      toast.error(message);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (file: File) => {
      // Загружаем файл
      const uploadResponse = await profileApi.uploadAvatar(file);
      
      // Обновляем профиль с новым URL аватара
      return profileApi.updateProfile(user!.id, { avatar: uploadResponse.url });
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      toast.success('Аватар обновлён');
    },
    onError: () => {
      toast.error('Ошибка загрузки аватара');
    },
  });
};
