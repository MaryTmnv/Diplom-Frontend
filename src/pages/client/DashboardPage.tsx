import { Breadcrumbs } from '@/shared/components/Navigation';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

function DashboardPage () {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Мои заявки' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мои заявки</h1>
          <p className="text-gray-600 mt-1">Управление вашими обращениями</p>
        </div>

        <Link to="/client/tickets/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Создать заявку
          </Button>
        </Link>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Активные</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Решённые</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Всего</CardDescription>
            <CardTitle className="text-3xl">15</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активные заявки</CardTitle>
          <CardDescription>Ваши текущие обращения в поддержку</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Здесь будет список заявок...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default DashboardPage;