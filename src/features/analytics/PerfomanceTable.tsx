
import { Avatar } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';
import { Star } from 'lucide-react';

const operators = [
  {
    id: '1',
    name: 'Анна Иванова',
    avatar: null,
    resolved: 45,
    avgTime: 1.8,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Петр Смирнов',
    avatar: null,
    resolved: 42,
    avgTime: 2.1,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Мария Петрова',
    avatar: null,
    resolved: 38,
    avgTime: 2.3,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Иван Сидоров',
    avatar: null,
    resolved: 35,
    avgTime: 2.5,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Ольга Козлова',
    avatar: null,
    resolved: 32,
    avgTime: 2.7,
    rating: 4.5,
  },
];

export const PerformanceTable = () => {
  return (
    <div className="space-y-4">
      {operators.map((operator, index) => (
        <div
          key={operator.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {/* Позиция */}
          <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary-700">#{index + 1}</span>
          </div>

          {/* Аватар и имя */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="w-10 h-10">
              <AvatarImage src={operator.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                {operator.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{operator.name}</p>
              <p className="text-xs text-gray-500">Оператор</p>
            </div>
          </div>

          {/* Метрики */}
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-gray-900">{operator.resolved}</p>
              <p className="text-xs text-gray-500">решено</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">{operator.avgTime}ч</p>
              <p className="text-xs text-gray-500">среднее</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{operator.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
