import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Breadcrumbs } from '@/shared/components/Navigation';

import { useAuthStore } from '@/features/auth/store/authStore';
import { useChangePassword } from '@/features/auth/hooks/useProfile';
import { changePasswordSchema, ChangePasswordFormData } from '@/shared/lib/schemas/profileSchemas';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Bell, 
  Mail, 
  MessageSquare,
  Shield,
  Trash2,
  AlertTriangle,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Label, Input, Button } from '@/shared/ui';
import { Checkbox } from '@/shared/ui/Checkbox';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { mutate: changePassword, isPending } = useChangePassword();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Настройки уведомлений (локальное состояние)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    if (!user) return;

    changePassword({
      userId: user.id,
      data: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
    });
  };

  const handleSaveNotifications = () => {
    // TODO: Отправить на сервер
    toast.success('Настройки уведомлений сохранены');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены? Это действие нельзя отменить!')) {
      // TODO: Реализовать удаление аккаунта
      toast.error('Удаление аккаунта временно недоступно');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
  <Breadcrumbs items={[{ label: 'Настройки' }]} />

  {/* Header */}
  <div className="flex items-start gap-4">
    <div className="w-14 h-14 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-2xl flex items-center justify-center shadow-lg">
      <Settings className="w-7 h-7 text-white" />
    </div>
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#03045e]">Настройки</h1>
      <p className="text-[#023e8a]/70 mt-1 text-lg">Управление аккаунтом и уведомлениями</p>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Смена пароля */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Безопасность</CardTitle>
            <CardDescription className="text-[#023e8a]/60 mt-0.5">
              Измените пароль для защиты аккаунта
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Текущий пароль */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="label-required text-[#03045e] font-medium">
              Текущий пароль
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                {...register('currentPassword')}
                aria-invalid={!!errors.currentPassword}
                className="pr-10 rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#023e8a]/40 hover:text-[#0077b6] transition-colors"
                tabIndex={-1}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full" />
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Новый пароль */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="label-required text-[#03045e] font-medium">
              Новый пароль
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword')}
                aria-invalid={!!errors.newPassword}
                className="pr-10 rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#023e8a]/40 hover:text-[#0077b6] transition-colors"
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full" />
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Подтверждение пароля */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="label-required text-[#03045e] font-medium">
              Подтвердите новый пароль
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                aria-invalid={!!errors.confirmPassword}
                className="pr-10 rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#023e8a]/40 hover:text-[#0077b6] transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Предупреждение */}
          <div className="p-4 bg-[#ade8f4]/30 border border-[#48cae4]/50 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 bg-[#48cae4]/30 rounded-lg flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#0077b6]" />
            </div>
            <p className="text-sm text-[#023e8a]/80">
              После смены пароля вы будете разлогинены на всех устройствах
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex items-center gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Изменение...
                </>
              ) : (
                'Изменить пароль'
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              className="text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
            >
              Отменить
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Уведомления */}
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-xl flex items-center justify-center shadow-md">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Уведомления</CardTitle>
            <CardDescription className="text-[#023e8a]/60 mt-0.5">
              Настройте способы получения уведомлений
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Email уведомления */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#caf0f8]/20 hover:bg-[#caf0f8]/40 transition-colors cursor-pointer group"
             onClick={() => setEmailNotifications(!emailNotifications)}>
          <Checkbox
            id="emailNotifications"
            checked={emailNotifications}
            onCheckedChange={(checked) => setEmailNotifications(!!checked)}
            className="mt-0.5 border-[#90e0ef] data-[state=checked]:bg-[#0077b6] data-[state=checked]:border-[#0077b6]"
          />
          <div className="flex-1">
            <Label
              htmlFor="emailNotifications"
              className="font-semibold cursor-pointer flex items-center gap-2 text-[#03045e] group-hover:text-[#0077b6] transition-colors"
            >
              <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#0077b6]" />
              </div>
              Email уведомления
            </Label>
            <p className="text-sm text-[#023e8a]/60 mt-1.5 ml-10">
              Получать уведомления о новых сообщениях и обновлениях заявок на email
            </p>
          </div>
        </div>

        {/* Push уведомления */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#caf0f8]/20 hover:bg-[#caf0f8]/40 transition-colors cursor-pointer group"
             onClick={() => setPushNotifications(!pushNotifications)}>
          <Checkbox
            id="pushNotifications"
            checked={pushNotifications}
            onCheckedChange={(checked) => setPushNotifications(!!checked)}
            className="mt-0.5 border-[#90e0ef] data-[state=checked]:bg-[#0077b6] data-[state=checked]:border-[#0077b6]"
          />
          <div className="flex-1">
            <Label
              htmlFor="pushNotifications"
              className="font-semibold cursor-pointer flex items-center gap-2 text-[#03045e] group-hover:text-[#0077b6] transition-colors"
            >
              <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#0077b6]" />
              </div>
              Браузерные уведомления
            </Label>
            <p className="text-sm text-[#023e8a]/60 mt-1.5 ml-10">
              Показывать уведомления в браузере даже когда вкладка неактивна
            </p>
          </div>
        </div>

        {/* Уведомления о сообщениях */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#caf0f8]/20 hover:bg-[#caf0f8]/40 transition-colors cursor-pointer group"
             onClick={() => setMessageNotifications(!messageNotifications)}>
          <Checkbox
            id="messageNotifications"
            checked={messageNotifications}
            onCheckedChange={(checked) => setMessageNotifications(!!checked)}
            className="mt-0.5 border-[#90e0ef] data-[state=checked]:bg-[#0077b6] data-[state=checked]:border-[#0077b6]"
          />
          <div className="flex-1">
            <Label
              htmlFor="messageNotifications"
              className="font-semibold cursor-pointer flex items-center gap-2 text-[#03045e] group-hover:text-[#0077b6] transition-colors"
            >
              <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-[#0077b6]" />
              </div>
              Уведомления о сообщениях
            </Label>
            <p className="text-sm text-[#023e8a]/60 mt-1.5 ml-10">
              Получать уведомления о каждом новом сообщении в чате
            </p>
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="pt-4 border-t border-[#90e0ef]/30">
          <Button 
            onClick={handleSaveNotifications}
            className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
          >
            Сохранить настройки
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Опасная зона */}
    <Card className="border-2 border-red-200 lg:col-span-2 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-red-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-red-600">Опасная зона</CardTitle>
            
            <CardDescription className="text-red-500/70 mt-0.5">
              Необратимые действия с аккаунтом
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-[#03045e] text-lg mb-1">
                Удалить аккаунт
              </p>
              <p className="text-sm text-[#023e8a]/70 max-w-md">
                Все ваши данные будут безвозвратно удалены. Это действие нельзя отменить.
              </p>
            </div>
          </div>
          <Button
            onClick={handleDeleteAccount}
            className="shrink-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 py-2.5 transition-all duration-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить аккаунт
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>

  );
};

export default SettingsPage;
