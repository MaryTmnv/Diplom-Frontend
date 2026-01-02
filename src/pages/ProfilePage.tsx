import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { Lock } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useUpdateProfile, useUploadAvatar } from '@/features/auth/hooks/useProfile';
import { updateProfileSchema, UpdateProfileFormData } from '@/shared/lib/schemas/profileSchemas';
import { Camera, Loader2, Mail, Phone, Calendar, Shield, BarChart3, CheckCircle, Edit3, FileText, HelpCircle, Info, MessageSquare, Save, Star, User, X } from 'lucide-react';
import { formatDate } from '@/shared/lib/utils/formatters';
import toast from 'react-hot-toast';
import { Card, CardContent, Avatar, CardHeader, CardTitle, CardDescription, Label, Input, Button } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigator = useNavigate();
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
    <div className="space-y-8">
  <Breadcrumbs items={[{ label: 'Профиль' }]} />

  {/* Header */}
  <div className="flex items-start gap-4">
    <div className="w-14 h-14 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-2xl flex items-center justify-center shadow-lg">
      <User className="w-7 h-7 text-white" />
    </div>
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#03045e]">Профиль</h1>
      <p className="text-[#023e8a]/70 mt-1 text-lg">Управление личной информацией</p>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Левая колонка - Аватар и основная информация */}
    <div className="lg:col-span-1 space-y-6">
      {/* Аватар */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/20">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Avatar с декоративным кольцом */}
            <div className="relative inline-block mb-6">
              {/* Декоративное кольцо */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#48cae4] to-[#0077b6] rounded-full blur-sm scale-105 opacity-50" />
              
              <Avatar className="w-36 h-36 border-4 border-white shadow-2xl relative">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#0096c7] to-[#03045e] text-white text-4xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>

              {/* Кнопка смены аватара */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-1 right-1 w-11 h-11 bg-gradient-to-br from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ring-3 ring-white"
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

            <h2 className="text-2xl font-bold text-[#03045e]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-[#023e8a]/60 mt-1">{user.email}</p>

            {/* Роль */}
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-gradient-to-r from-[#caf0f8] to-[#ade8f4] text-[#0077b6] rounded-full text-sm font-semibold shadow-sm">
              <Shield className="w-4 h-4" />
              {/* {user.role === 'client' && 'Клиент'}
              {user.role === 'operator' && 'Оператор'}
              {user.role === 'manager' && 'Руководитель'} */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика (для клиента) */}
      {user.clientProfile && (
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-xl flex items-center justify-center shadow-md">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-[#03045e]">Статистика</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 bg-[#caf0f8]/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#0077b6]" />
                </div>
                <span className="text-sm text-[#023e8a]/70">Всего заявок</span>
              </div>
              <span className="text-xl font-bold text-[#03045e]">
                {user.clientProfile.totalTickets}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#caf0f8]/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-[#023e8a]/70">Решено</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {user.clientProfile.resolvedTickets}
              </span>
            </div>
            
            {user.clientProfile.isVip && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-700">VIP статус</span>
                    <p className="text-xs text-amber-600/70">Приоритетная поддержка</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Информация об аккаунте */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-xl flex items-center justify-center shadow-md">
              <Info className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-[#03045e]">Информация</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center gap-4 p-3 bg-[#caf0f8]/30 rounded-xl">
            <div className="w-10 h-10 bg-[#90e0ef]/50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-xs text-[#023e8a]/50 font-medium">Дата регистрации</p>
              <p className="font-semibold text-[#03045e]">
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
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-[#03045e]">Личные данные</CardTitle>
              <CardDescription className="text-[#023e8a]/60 mt-0.5">
                Обновите вашу личную информацию
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Имя и Фамилия */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="label-required text-[#03045e] font-medium">
                  Имя
                </Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  aria-invalid={!!errors.firstName}
                  className="rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="label-required text-[#03045e] font-medium">
                  Фамилия
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  aria-invalid={!!errors.lastName}
                  className="rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email (только для чтения) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#03045e] font-medium">Email</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#90e0ef]/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#0077b6]" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="pl-14 bg-[#caf0f8]/20 border-[#90e0ef]/50 rounded-xl text-[#023e8a]/70"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-[#023e8a]/30"></Lock>
                </div>
              </div>
              <p className="text-xs text-[#023e8a]/50 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Email нельзя изменить
              </p>
            </div>

            {/* Телефон */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#03045e] font-medium">Телефон</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#90e0ef]/30 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#0077b6]" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  className="pl-14 rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
                  {...register('phone')}
                  aria-invalid={!!errors.phone}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#90e0ef]/30">
              <Button
                type="submit"
                disabled={!isDirty || isPending}
                className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2"/>
                    Сохранить изменения
                  </>
                )}
              </Button>

              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  className="text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Отменить
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Дополнительная информационная карточка */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-[#caf0f8]/50 to-[#ade8f4]/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#03045e] text-lg mb-1">
                Нужна помощь?
              </h3>
              <p className="text-[#023e8a]/70 text-sm mb-4">
                Если у вас возникли вопросы по настройке профиля или работе с системой, 
                обратитесь в службу поддержки.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-xl transition-all"
                onClick={() => navigator('/client/tickets/create')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Создать заявку
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>

  );
};

export default ProfilePage;
