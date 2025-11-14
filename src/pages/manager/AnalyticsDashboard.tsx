import { Breadcrumbs } from "@/shared/components/Navigation";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/shared/ui";
import { TrendingUp, TrendingDown } from "lucide-react";

function AnalyticsDashboard () {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Аналитика' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
        <p className="text-gray-600 mt-1">Обзор производительности поддержки</p>
      </div>

      {/* Ключевые метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Всего заявок</CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-green-600 mt-1">+12% от прошлой недели</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Решённые</CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">198</div>
            <p className="text-xs text-green-600 mt-1">+8% от прошлой недели</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Среднее время</CardDescription>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 ч</div>
            <p className="text-xs text-red-600 mt-1">-5% от прошлой недели</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Удовлетворённость</CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600 mt-1">+2% от прошлой недели</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>График заявок</CardTitle>
          <CardDescription>Динамика за последние 7 дней</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-12">
            Здесь будет график (Recharts)...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;