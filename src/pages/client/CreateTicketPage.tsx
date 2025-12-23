import { TicketForm } from '@/features/tickets/components/TicketForm/TicketForm';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { Button } from '@/shared/ui';
import { Plus, Zap, Shield, Clock, HelpCircle, BookOpen, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CreateTicketPage ()  {
  const navigator = useNavigate();
  return (
    <div className="space-y-8">
  <Breadcrumbs
    items={[
      { label: 'Мои заявки', href: '/client/dashboard' },
      { label: 'Создать заявку' },
    ]}
  />

  {/* Hero Section */}
  <div className="text-center max-w-2xl mx-auto">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-2xl mb-6 shadow-lg">
      <Plus className="w-8 h-8 text-white" />
    </div>
    
    <h1 className="text-4xl md:text-5xl font-bold text-[#03045e] mb-4 tracking-tight">
      Создать заявку
    </h1>
    <p className="text-lg text-[#023e8a]/70 leading-relaxed">
      Опишите вашу проблему, и мы поможем её решить в кратчайшие сроки
    </p>
  </div>

  {/* Info Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 rounded-xl border border-[#90e0ef]/30">
      <div className="w-10 h-10 bg-[#0077b6] rounded-xl flex items-center justify-center shadow-md">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#03045e]">Быстро</p>
        <p className="text-xs text-[#023e8a]/60">Ответ за 15 минут</p>
      </div>
    </div>

    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 rounded-xl border border-[#90e0ef]/30">
      <div className="w-10 h-10 bg-[#00b4d8] rounded-xl flex items-center justify-center shadow-md">
        <Shield className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#03045e]">Надёжно</p>
        <p className="text-xs text-[#023e8a]/60">Защита данных</p>
      </div>
    </div>

    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 rounded-xl border border-[#90e0ef]/30">
      <div className="w-10 h-10 bg-[#0096c7] rounded-xl flex items-center justify-center shadow-md">
        <Clock className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#03045e]">24/7</p>
        <p className="text-xs text-[#023e8a]/60">Круглосуточно</p>
      </div>
    </div>
  </div>

  {/* Form */}
  <TicketForm />

  {/* Help Section */}
  <div className="max-w-3xl mx-auto">
    <div className="p-6 bg-gradient-to-r from-[#caf0f8]/40 to-[#ade8f4]/20 rounded-2xl border border-[#48cae4]/30">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#03045e] text-lg mb-2">
            Нужна помощь с заполнением?
          </h3>
          <p className="text-sm text-[#023e8a]/70 mb-4">
            Посмотрите примеры заявок или ознакомьтесь с базой знаний — возможно, 
            ответ на ваш вопрос уже есть там.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator('/knowledge-base')}
              className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-xl transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              База знаний
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator('/client/tickets')}
              className="text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              Мои заявки
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default CreateTicketPage;
