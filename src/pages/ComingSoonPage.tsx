
import { Card, CardContent, Button } from '@/shared/ui';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {
  title: string;
  description?: string;
  backLink?: string;
}

export const ComingSoonPage = ({ 
  title, 
  description = 'Мы работаем над этим функционалом. Скоро он будет доступен!',
  backLink = '/'
}: ComingSoonPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* Иконка */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-primary-600" />
          </div>

          {/* Заголовок */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h1>

          {/* Описание */}
          <p className="text-gray-600 mb-6">
            {description}
          </p>

          {/* Кнопка назад */}
          <Button
            variant="outline"
            onClick={() => navigate(backLink)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться назад
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
