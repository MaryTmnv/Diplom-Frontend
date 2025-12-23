import { useState } from 'react';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { Card, CardContent, Input, Select, CardHeader, Avatar, CardTitle, CardDescription, DropdownMenu, Button, DropdownMenuItem } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';
import { DropdownMenuTrigger, DropdownMenuContent } from '@/shared/ui/DropdownMenu';
import { Badge, Search, Filter, MoreVertical, MessageSquare, CheckCircle, Clock, Star, TrendingUp } from 'lucide-react';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';


interface Operator {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'OPERATOR' | 'SPECIALIST';
  status: 'online' | 'offline' | 'busy';
  stats: {
    totalTickets: number;
    resolvedTickets: number;
    avgResponseTime: number; // минуты
    avgResolutionTime: number; // часы
    rating: number;
    activeTickets: number;
  };
}

// Mock данные
const operators: Operator[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    email: 'anna.ivanova@helpmate.ru',
    avatar: null,
    role: 'SPECIALIST',
    status: 'online',
    stats: {
      totalTickets: 245,
      resolvedTickets: 238,
      avgResponseTime: 3,
      avgResolutionTime: 1.8,
      rating: 4.9,
      activeTickets: 7,
    },
  },
  {
    id: '2',
    name: 'Петр Смирнов',
    email: 'petr.smirnov@helpmate.ru',
    avatar: null,
    role: 'OPERATOR',
    status: 'online',
    stats: {
      totalTickets: 198,
      resolvedTickets: 185,
      avgResponseTime: 5,
      avgResolutionTime: 2.1,
      rating: 4.8,
      activeTickets: 13,
    },
  },
  {
    id: '3',
    name: 'Мария Петрова',
    email: 'maria.petrova@helpmate.ru',
    avatar: null,
    role: 'OPERATOR',
    status: 'busy',
    stats: {
      totalTickets: 176,
      resolvedTickets: 168,
      avgResponseTime: 4,
      avgResolutionTime: 2.3,
      rating: 4.7,
      activeTickets: 8,
    },
  },
  {
    id: '4',
    name: 'Иван Сидоров',
    email: 'ivan.sidorov@helpmate.ru',
    avatar: null,
    role: 'OPERATOR',
    status: 'offline',
    stats: {
      totalTickets: 152,
      resolvedTickets: 145,
      avgResponseTime: 6,
      avgResolutionTime: 2.5,
      rating: 4.6,
      activeTickets: 7,
    },
  },
  {
    id: '5',
    name: 'Ольга Козлова',
    email: 'olga.kozlova@helpmate.ru',
    avatar: null,
    role: 'OPERATOR',
    status: 'online',
    stats: {
      totalTickets: 134,
      resolvedTickets: 128,
      avgResponseTime: 5,
      avgResolutionTime: 2.7,
      rating: 4.5,
      activeTickets: 6,
    },
  },
];

const TeamPerformancePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Фильтрация
  const filteredOperators = operators.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         op.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Статусы
  const getStatusBadge = (status: Operator['status']) => {
    const variants = {
      online: { label: 'Онлайн', className: 'bg-green-100 text-green-700' },
      offline: { label: 'Оффлайн', className: 'bg-gray-100 text-gray-700' },
      busy: { label: 'Занят', className: 'bg-yellow-100 text-yellow-700' },
    };
    
    const variant = variants[status];
    
    return (
      <Badge className={variant.className}>
        <span className="w-2 h-2 rounded-full bg-current mr-1.5" />
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Команда' }]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Команда</h1>
        <p className="text-gray-600 mt-1">
          Управление операторами и производительность
        </p>
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

            {/* Фильтр по статусу */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="online">Онлайн</SelectItem>
                <SelectItem value="busy">Занят</SelectItem>
                <SelectItem value="offline">Оффлайн</SelectItem>
              </SelectContent>
            </Select>

            {/* Фильтр по роли */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="OPERATOR">Оператор</SelectItem>
                <SelectItem value="SPECIALIST">Специалист</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Список операторов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOperators.map((operator) => (
          <Card key={operator.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={operator.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold">
                      {operator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <CardTitle className="text-lg">{operator.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {operator.email}
                    </CardDescription>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Просмотр профиля</DropdownMenuItem>
                    <DropdownMenuItem>Назначить заявки</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Заблокировать
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 mt-3">
                {getStatusBadge(operator.status)}
                <Badge>
                  {operator.role === 'SPECIALIST' ? 'Специалист' : 'Оператор'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Статистика */}
              <div className="grid grid-cols-2 gap-4">
                {/* Всего заявок */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Всего</p>
                    <p className="text-lg font-bold text-gray-900">
                      {operator.stats.totalTickets}
                    </p>
                  </div>
                </div>

                {/* Решено */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Решено</p>
                    <p className="text-lg font-bold text-gray-900">
                      {operator.stats.resolvedTickets}
                    </p>
                  </div>
                </div>

                {/* Среднее время */}
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Среднее</p>
                    <p className="text-lg font-bold text-gray-900">
                      {operator.stats.avgResolutionTime}ч
                    </p>
                  </div>
                </div>

                {/* Рейтинг */}
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Рейтинг</p>
                    <p className="text-lg font-bold text-gray-900">
                      {operator.stats.rating}
                    </p>
                  </div>
                </div>
              </div>

              {/* Активные заявки */}
              {operator.stats.activeTickets > 0 && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      {operator.stats.activeTickets} активных заявок
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredOperators.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ничего не найдено
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить фильтры или поисковый запрос
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamPerformancePage;
