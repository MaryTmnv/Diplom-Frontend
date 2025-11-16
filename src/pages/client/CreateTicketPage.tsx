import { TicketForm } from '@/features/tickets/components/TicketForm/TicketForm';
import { Breadcrumbs } from '@/shared/components/Navigation';

function CreateTicketPage ()  {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Мои заявки', href: '/client/dashboard' },
          { label: 'Создать заявку' },
        ]}
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Создать заявку
        </h1>
        <p className="text-gray-600">
          Опишите вашу проблему, и мы поможем её решить
        </p>
      </div>

      <TicketForm />
    </div>
  );
};

export default CreateTicketPage;
