import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Breadcrumbs } from '@/shared/components/Navigation';

import { useAuthStore } from '@/features/auth/store/authStore';
import { useUpdateProfile, useUploadAvatar } from '@/features/auth/hooks/useProfile';
import { updateProfileSchema, UpdateProfileFormData } from '@/shared/lib/schemas/profileSchemas';
import { Camera, Loader2, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { formatDate } from '@/shared/lib/utils/formatters';
import toast from 'react-hot-toast';
import { Card, CardContent, Avatar, CardHeader, CardTitle, CardDescription, Label, Input, Button } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    updateProfile(data);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл слишком большой. Максимум 5MB');
      return;
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      toast.error('Можно загружать только изображения');
      return;
    }

    uploadAvatar(file);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Профиль' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
        <p className="text-gray-600 mt-1">Управление личной информацией</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - Аватар и основная информация */}
        <div className="lg:col-span-1 space-y-6">
          {/* Аватар */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Кнопка смены аватара */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>

                {/* Роль */}
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  {user.role}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Статистика (для клиента) */}
          {user.clientProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Всего заявок:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {user.clientProfile.totalTickets}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Решено:</span>
                  <span className="text-lg font-bold text-green-600">
                    {user.clientProfile.resolvedTickets}
                  </span>
                </div>
                {user.clientProfile.isVip && (
                  <div className="pt-3 border-t">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600">
                      ⭐ VIP статус
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Информация об аккаунте */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Дата регистрации</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(user.createdAt, 'dd MMMM yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - Формы */}
        <div className="lg:col-span-2 space-y-6">
          {/* Форма редактирования профиля */}
          <Card>
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
              <CardDescription>
                Обновите вашу личную информацию
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Имя и Фамилия */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="label-required">
                      Имя
                    </Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="label-required">
                      Фамилия
                    </Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email (только для чтения) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Email нельзя изменить
                  </p>
                </div>

                {/* Телефон */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      className="pl-10"
                      {...register('phone')}
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Кнопки */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={!isDirty || isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      'Сохранить изменения'
                    )}
                  </Button>

                  {isDirty && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => window.location.reload()}
                    >
                      Отменить
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
