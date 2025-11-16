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
  Trash2
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
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Настройки' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-1">Управление аккаунтом и уведомлениями</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Смена пароля */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" />
              <CardTitle>Безопасность</CardTitle>
            </div>
            <CardDescription>
              Измените пароль для защиты аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Текущий пароль */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="label-required">
                  Текущий пароль
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...register('currentPassword')}
                    aria-invalid={!!errors.currentPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* Новый пароль */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="label-required">
                  Новый пароль
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    aria-invalid={!!errors.newPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Подтверждение пароля */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="label-required">
                  Подтвердите новый пароль
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={isPending}>
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
                >
                  Отменить
                </Button>
              </div>

              {/* Предупреждение */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  ⚠️ После смены пароля вы будете разлогинены на всех устройствах
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Уведомления */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <CardTitle>Уведомления</CardTitle>
            </div>
            <CardDescription>
              Настройте способы получения уведомлений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email уведомления */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={(checked) => setEmailNotifications(!!checked)}
              />
              <div className="flex-1">
                <Label
                  htmlFor="emailNotifications"
                  className="font-medium cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email уведомления
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Получать уведомления о новых сообщениях и обновлениях заявок на email
                </p>
              </div>
            </div>

            {/* Push уведомления */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="pushNotifications"
                checked={pushNotifications}
                onCheckedChange={(checked) => setPushNotifications(!!checked)}
              />
              <div className="flex-1">
                <Label
                  htmlFor="pushNotifications"
                  className="font-medium cursor-pointer flex items-center gap-2"
                >
                  <Bell className="w-4 h-4 text-gray-500" />
                  Браузерные уведомления
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Показывать уведомления в браузере даже когда вкладка неактивна
                </p>
              </div>
            </div>

            {/* Уведомления о сообщениях */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="messageNotifications"
                checked={messageNotifications}
                onCheckedChange={(checked) => setMessageNotifications(!!checked)}
              />
              <div className="flex-1">
                <Label
                  htmlFor="messageNotifications"
                  className="font-medium cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  Уведомления о сообщениях
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Получать уведомления о каждом новом сообщении в чате
                </p>
              </div>
            </div>

            {/* Кнопка сохранения */}
            <div className="pt-4 border-t">
              <Button onClick={handleSaveNotifications}>
                Сохранить настройки
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Опасная зона */}
        <Card className="border-red-200 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <CardTitle className="text-red-600">Опасная зона</CardTitle>
            </div>
            <CardDescription>
              Необратимые действия с аккаунтом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Удалить аккаунт
                </p>
                <p className="text-sm text-gray-600">
                  Все ваши данные будут безвозвратно удалены. Это действие нельзя отменить.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                className="shrink-0"
              >
                Удалить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
