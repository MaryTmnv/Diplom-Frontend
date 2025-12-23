import { UseFormReturn } from 'react-hook-form';
import { getCategoryLabel, getCategoryIcon } from '../../utils/ticketHelpers';
import { cn } from '@/shared/lib/utils/cn';
import { CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { Label, Input, Button } from '@/shared/ui';
import { TicketCategory } from '../../types/tickets.types';
import { FileText, AlertCircle, Info, Tag, Check, Lightbulb, Search, TrendingUp } from 'lucide-react';

interface Step1DescriptionProps {
  form: UseFormReturn<CreateTicketFormData>;
}

const categories = [
  TicketCategory.CARDS,
  TicketCategory.DEPOSITS,
  TicketCategory.LOANS,
  TicketCategory.MOBILE_APP,
  TicketCategory.PAYMENTS,
  TicketCategory.SECURITY,
  TicketCategory.OTHER,
];
const getPopularQuestions = (category: TicketCategory): string[] => {
  const questions: Record<TicketCategory, string[]> = {
    [TicketCategory.CARDS]: [
      'Не могу активировать карту',
      'Карта заблокирована',
      'Не приходит SMS-код',
    ],
    [TicketCategory.ACCOUNTS]: [
      'Не могу войти в личный кабинет',
      'Забыл пароль',
      'Ошибка при входе',
    ],
    [TicketCategory.PAYMENTS]: [
      'Платёж не прошёл',
      'Двойное списание',
      'Вернуть платёж',
    ],
    [TicketCategory.LOANS]: [
      'Узнать остаток по кредиту',
      'Изменить дату платежа',
      'Досрочное погашение',
    ],
    [TicketCategory.OTHER]: [
      'Другой вопрос',
      'Предложение по улучшению',
      'Жалоба',
    ],
    [TicketCategory.DEPOSITS]: [],
    [TicketCategory.MOBILE_APP]: [],
    [TicketCategory.SECURITY]: []
  };
  
  return questions[category] || [];
};

export const Step1Description = ({ form }: Step1DescriptionProps) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const selectedCategory = watch('category');

  return (
    <div className="space-y-8">
  {/* Заголовок */}
  <div className="space-y-3">
    <Label htmlFor="title" className="label-required text-[#03045e] font-semibold text-base">
      Кратко опишите проблему
    </Label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#90e0ef]/30 rounded-xl flex items-center justify-center">
        <FileText className="w-5 h-5 text-[#0077b6]" />
      </div>
      <Input
        id="title"
        placeholder="Например: Не могу войти в приложение"
        {...register('title')}
        aria-invalid={!!errors.title}
        className="pl-16 py-6 text-base rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
      />
    </div>
    {errors.title ? (
      <p className="text-sm text-red-600 flex items-center gap-1.5">
        <AlertCircle className="w-4 h-4" />
        {errors.title.message}
      </p>
    ) : (
      <p className="text-xs text-[#023e8a]/50 flex items-center gap-1.5">
        <Info className="w-3 h-3" />
        От 5 до 200 символов
      </p>
    )}
  </div>

  {/* Категория */}
  <div className="space-y-4">
    <Label className="label-required text-[#03045e] font-semibold text-base flex items-center gap-2">
      <Tag className="w-4 h-4 text-[#0077b6]" />
      Выберите категорию
    </Label>
    
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        
        return (
          <button
            key={category}
            type="button"
            onClick={() => setValue('category', category, { shouldValidate: true })}
            className={cn(
              'group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden',
              isSelected
                ? 'border-[#0077b6] bg-gradient-to-br from-[#caf0f8] to-[#ade8f4]/50 shadow-lg shadow-[#0077b6]/10'
                : 'border-[#90e0ef]/50 bg-white hover:border-[#48cae4] hover:bg-[#caf0f8]/30 hover:shadow-md'
            )}
          >
            {/* Индикатор выбора */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-full flex items-center justify-center shadow-md">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div 
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300',
                  isSelected 
                    ? 'bg-gradient-to-br from-[#0077b6] to-[#023e8a] shadow-md' 
                    : 'bg-[#caf0f8]/50 group-hover:bg-[#90e0ef]/50'
                )}
              >
                <span className={isSelected ? 'grayscale-0 brightness-0 invert' : ''}>
                  {getCategoryIcon(category)}
                </span>
              </div>
              <span 
                className={cn(
                  'font-semibold text-sm transition-colors duration-300',
                  isSelected ? 'text-[#03045e]' : 'text-[#023e8a]/70 group-hover:text-[#03045e]'
                )}
              >
                {getCategoryLabel(category)}
              </span>
            </div>

            {/* Hover эффект */}
            <div 
              className={cn(
                'absolute inset-0 bg-gradient-to-br from-[#0077b6]/5 to-transparent opacity-0 transition-opacity duration-300',
                !isSelected && 'group-hover:opacity-100'
              )} 
            />
          </button>
        );
      })}
    </div>

    {errors.category && (
      <p className="text-sm text-red-600 flex items-center gap-1.5">
        <AlertCircle className="w-4 h-4" />
        {errors.category.message}
      </p>
    )}
  </div>

  {/* Подсказка */}
  {selectedCategory && (
    <div className="p-5 bg-gradient-to-br from-[#caf0f8]/50 to-[#ade8f4]/30 border border-[#48cae4]/30 rounded-2xl animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#03045e] mb-1.5">
            Прежде чем создавать заявку
          </p>
          <p className="text-sm text-[#023e8a]/70 leading-relaxed">
            Возможно, ответ на ваш вопрос уже есть в{' '}
            <a
              href="/knowledge-base"
              target="_blank"
              className="text-[#0077b6] font-semibold hover:text-[#023e8a] underline underline-offset-2 transition-colors"
            >
              базе знаний
            </a>
            . Это поможет решить проблему быстрее!
          </p>
          
          {/* Быстрые ссылки на статьи по категории */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-[#0077b6] bg-white hover:bg-[#0077b6] hover:text-white rounded-lg shadow-sm transition-all"
              onClick={() => window.open('/knowledge-base?category=' + selectedCategory, '_blank')}
            >
              <Search className="w-3 h-3 mr-1.5" />
              Искать по категории
            </Button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Популярные вопросы (опционально) */}
  {selectedCategory && (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[#023e8a]/60 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Популярные вопросы в этой категории
      </p>
      <div className="flex flex-wrap gap-2">
        {getPopularQuestions(selectedCategory).slice(0, 3).map((question, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setValue('title', question, { shouldValidate: true })}
            className="px-3 py-2 text-xs text-[#023e8a]/70 bg-[#caf0f8]/30 hover:bg-[#ade8f4]/50 hover:text-[#03045e] rounded-lg border border-[#90e0ef]/30 transition-all"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )}
</div>

  );
};
