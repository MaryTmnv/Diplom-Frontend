import { Breadcrumbs } from "@/shared/components/Navigation";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/shared/ui";


function QueuePage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Очередь заявок' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Очередь заявок</h1>
        <p className="text-gray-600 mt-1">Новые обращения клиентов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>В очереди</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>В работе</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Ожидание</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Решено сегодня</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Заявки</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Здесь будет очередь заявок...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default QueuePage;