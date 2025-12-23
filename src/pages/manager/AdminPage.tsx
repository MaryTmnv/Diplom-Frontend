import { useState } from 'react';
import { Breadcrumbs } from '@/shared/components/Navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings,
  Trash2,
  Edit,
  Lock,
  Unlock,
  Mail,
  Search,
  MoreVertical,
  Database,
  Activity,
  AlertTriangle,
  Badge
} from 'lucide-react';

import toast from 'react-hot-toast';
import { UserRole } from '@/shared/types/user.types';
import { Dialog, Button, DialogContent, DialogHeader, DialogTitle, DialogDescription, Input, DialogFooter, Card, CardContent, Avatar, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, CardHeader, CardTitle, CardDescription } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';
import { DialogTrigger } from '@/shared/ui/Dialog';
import { DropdownMenuTrigger, DropdownMenuContent } from '@/shared/ui/DropdownMenu';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Label } from 'recharts';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
  lastLogin: string | null;
}

// Mock данные
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Анна',
    lastName: 'Иванова',
    email: 'anna.ivanova@helpmate.ru',
    avatar: null,
    role: UserRole.SPECIALIST,
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-12-23T10:30:00',
  },
  {
    id: '2',
    firstName: 'Петр',
    lastName: 'Смирнов',
    email: 'petr.smirnov@helpmate.ru',
    avatar: null,
    role: UserRole.OPERATOR,
    status: 'active',
    createdAt: '2024-02-20',
    lastLogin: '2024-12-23T09:15:00',
  },
  {
    id: '3',
    firstName: 'Мария',
    lastName: 'Петрова',
    email: 'maria.petrova@helpmate.ru',
    avatar: null,
    role: UserRole.OPERATOR,
    status: 'active',
    createdAt: '2024-03-10',
    lastLogin: '2024-12-22T16:45:00',
  },
  {
    id: '4',
    firstName: 'Иван',
    lastName: 'Козлов',
    email: 'ivan.kozlov@helpmate.ru',
    avatar: null,
    role: UserRole.MANAGER,
    status: 'active',
    createdAt: '2024-01-05',
    lastLogin: '2024-12-23T08:00:00',
  },
  {
    id: '5',
    firstName: 'Ольга',
    lastName: 'Сидорова',
    email: 'olga.sidorova@helpmate.ru',
    avatar: null,
    role: UserRole.CLIENT,
    status: 'blocked',
    createdAt: '2024-11-01',
    lastLogin: '2024-12-10T14:20:00',
  },
];

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Фильтрация пользователей
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Статистика
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length,
    clients: users.filter(u => u.role === UserRole.CLIENT).length,
    operators: users.filter(u => u.role === UserRole.OPERATOR || u.role === UserRole.SPECIALIST).length,
    managers: users.filter(u => u.role === UserRole.MANAGER).length,
  };

  // Действия с пользователями
  const handleBlockUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'blocked' as const } : u
    ));
    toast.success('Пользователь заблокирован');
  };

  const handleUnblockUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'active' as const } : u
    ));
    toast.success('Пользователь разблокирован');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('Пользователь удалён');
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    toast.success('Роль изменена');
  };

  // Получение badge для роли
  const getRoleBadge = (role: UserRole) => {
    const variants = {
      [UserRole.CLIENT]: { label: 'Клиент', className: 'bg-blue-100 text-blue-700' },
      [UserRole.OPERATOR]: { label: 'Оператор', className: 'bg-green-100 text-green-700' },
      [UserRole.SPECIALIST]: { label: 'Специалист', className: 'bg-purple-100 text-purple-700' },
      [UserRole.MANAGER]: { label: 'Менеджер', className: 'bg-orange-100 text-orange-700' },
      [UserRole.ADMIN]: { label: 'Админ', className: 'bg-red-100 text-red-700' },
    };
    
    const variant = variants[role];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  // Получение badge для статуса
  const getStatusBadge = (status: User['status']) => {
    const variants = {
      active: { label: 'Активен', className: 'bg-green-100 text-green-700' },
      blocked: { label: 'Заблокирован', className: 'bg-red-100 text-red-700' },
      pending: { label: 'Ожидает', className: 'bg-yellow-100 text-yellow-700' },
    };
    
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Администрирование' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Администрирование</h1>
          <p className="text-gray-600 mt-1">
            Управление пользователями и системой
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать пользователя</DialogTitle>
              <DialogDescription>
                Добавьте нового пользователя в систему
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label >Имя</Label>
                  <Input id="firstName" placeholder="Иван" />
                </div>
                <div className="space-y-2">
                  <Label >Фамилия</Label>
                  <Input id="lastName" placeholder="Иванов" />
                </div>
              </div>

              <div className="space-y-2">
                <Label >Email</Label>
                <Input id="email" type="email" placeholder="ivan@helpmate.ru" />
              </div>

              <div className="space-y-2">
                <Label >Роль</Label>
                <Select defaultValue={UserRole.CLIENT}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.CLIENT}>Клиент</SelectItem>
                    <SelectItem value={UserRole.OPERATOR}>Оператор</SelectItem>
                    <SelectItem value={UserRole.SPECIALIST}>Специалист</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Менеджер</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label >Временный пароль</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => {
                toast.success('Пользователь создан. Письмо с паролем отправлено.');
                setIsCreateDialogOpen(false);
              }}>
                Создать
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs с отступом */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Settings className="w-4 h-4" />
            Система
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Activity className="w-4 h-4" />
            Логи
          </TabsTrigger>
        </TabsList>

        {/* ========== ВКЛАДКА: ПОЛЬЗОВАТЕЛИ ========== */}
        <TabsContent value="users" className="space-y-6">
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600 mt-1">Всего</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-gray-600 mt-1">Активных</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                <p className="text-xs text-gray-600 mt-1">Заблокировано</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.clients}</p>
                <p className="text-xs text-gray-600 mt-1">Клиентов</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.operators}</p>
                <p className="text-xs text-gray-600 mt-1">Операторов</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.managers}</p>
                <p className="text-xs text-gray-600 mt-1">Менеджеров</p>
              </CardContent>
            </Card>
          </div>

          {/* Фильтры */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Поиск */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Поиск по имени или email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Фильтр по роли */}
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Все роли" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все роли</SelectItem>
                    <SelectItem value={UserRole.CLIENT}>Клиенты</SelectItem>
                    <SelectItem value={UserRole.OPERATOR}>Операторы</SelectItem>
                    <SelectItem value={UserRole.SPECIALIST}>Специалисты</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Менеджеры</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Админы</SelectItem>
                  </SelectContent>
                </Select>

                {/* Фильтр по статусу */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="blocked">Заблокированные</SelectItem>
                    <SelectItem value="pending">Ожидающие</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Таблица пользователей */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Роль
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Последний вход
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold">
                                {user.firstName[0]}{user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleString('ru-RU')
                            : 'Никогда'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast('Редактирование пользователя')}>
                                <Edit className="w-4 h-4 mr-2" />
                                Редактировать
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => toast('Отправка письма')}>
                                <Mail className="w-4 h-4 mr-2" />
                                Отправить письмо
                                </DropdownMenuItem>


                              <DropdownMenuSeparator />

                              {/* Блокировка/разблокировка */}
                              {user.status === 'active' ? (
                                <DropdownMenuItem
                                  onClick={() => handleBlockUser(user.id)}
                                  className="text-orange-600"
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  Заблокировать
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleUnblockUser(user.id)}
                                  className="text-green-600"
                                >
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Разблокировать
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              {/* Удаление */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Удалить
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Это действие нельзя отменить. Все данные пользователя будут удалены безвозвратно.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ничего не найдено
                  </h3>
                  <p className="text-gray-600">
                    Попробуйте изменить фильтры или поисковый запрос
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== ВКЛАДКА: СИСТЕМА ========== */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Информация о системе */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary-600" />
                  <CardTitle>Информация о системе</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Версия</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">База данных</span>
                  <span className="text-sm font-medium">PostgreSQL 15</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Использование диска</span>
                  <span className="text-sm font-medium">2.4 GB / 50 GB</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Последний бэкап</span>
                  <span className="text-sm font-medium">23.12.2024 03:00</span>
                </div>
              </CardContent>
            </Card>

            {/* Опасные действия */}
            <Card className="border-red-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-red-600">Опасная зона</CardTitle>
                </div>
                <CardDescription>
                  Необратимые действия с системой
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.success('Создание бэкапа...')}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Создать бэкап базы данных
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Очистить старые логи
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Очистить логи?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Будут удалены все логи старше 90 дней. Это действие нельзя отменить.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => toast.success('Логи очищены')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Очистить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== ВКЛАДКА: ЛОГИ ========== */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Системные логи</CardTitle>
              <CardDescription>
                Последние действия в системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '23.12.2024 10:30', user: 'Админ', action: 'Создал пользователя "Иван Петров"', type: 'success' },
                  { time: '23.12.2024 09:15', user: 'Система', action: 'Автоматический бэкап выполнен', type: 'info' },
                  { time: '22.12.2024 16:45', user: 'Админ', action: 'Заблокировал пользователя "Ольга Сидорова"', type: 'warning' },
                  { time: '22.12.2024 14:20', user: 'Система', action: 'Ошибка подключения к SMTP серверу', type: 'error' },
                  { time: '22.12.2024 12:00', user: 'Админ', action: 'Изменил роль пользователя "Петр Смирнов"', type: 'success' },
                ].map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      log.type === 'success' ? 'bg-green-500' :
                      log.type === 'error' ? 'bg-red-500' :
                      log.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {log.time} • {log.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
