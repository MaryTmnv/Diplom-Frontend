import { useState } from 'react';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { SearchBar } from '@/shared/components/SearchBar';
import { TemplateCard } from '@/features/templates/components/TemplateCard';
import { TemplateList } from '@/features/templates/components/TemplateList';
import { TemplateSelector } from '@/features/templates/components/TemplateSelector';
import { useTemplates, usePopularTemplates } from '@/features/templates/hooks/useTemplate';
import { Template } from '@/features/templates/types/template.types';
import { TicketCategory } from '@/features/tickets/types/tickets.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/shared/ui';
import { Sparkles, Badge, FileQuestion, FileText, LayoutGrid, LayoutList, Lightbulb, List, Plus, Search, Tag } from 'lucide-react';

function TemplatesPage (){
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | undefined>();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { data: templatesResponse, isLoading } = useTemplates({
    category: selectedCategory,
    search: searchQuery || undefined,
    sortBy: 'popular',
  });

  const { data: popularTemplates = [] } = usePopularTemplates(5);

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleTemplateApply = (content: string) => {
    // Копируем в буфер обмена
    navigator.clipboard.writeText(content);
    alert('Текст скопирован в буфер обмена! Вставьте его в чат.');
  };

  return (
    <div className="space-y-8">
  <Breadcrumbs items={[{ label: 'Шаблоны ответов' }]} />

  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-2xl flex items-center justify-center shadow-lg">
        <FileText className="w-7 h-7 text-white" />
      </div>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#03045e]">Шаблоны ответов</h1>
        <p className="text-[#023e8a]/70 mt-1 text-lg">
          Готовые ответы для быстрой работы с клиентами
        </p>
      </div>
    </div>

    <Button 
      className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-5 transition-all duration-300 self-start md:self-auto"
    >
      <Plus className="w-4 h-4 mr-2" />
      Создать шаблон
    </Button>
  </div>

  {/* Популярные шаблоны */}
  {popularTemplates.length > 0 && (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50/50 to-yellow-50/30 relative">
      {/* Декоративный элемент */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Популярные шаблоны</CardTitle>
            <CardDescription className="text-[#023e8a]/60 mt-0.5">
              Самые используемые шаблоны
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTemplates.map((template, index) => (
            <div 
              key={template.id}
              className="group relative bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-amber-100"
            >
              {/* Индикатор популярности */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md text-white text-xs font-bold">
                #{index + 1}
              </div>
              
              <TemplateCard
                template={template}
                onUse={() => handleUseTemplate(template)}
                compact
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )}

  {/* Поиск и фильтры */}
  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
    <CardContent className="p-6 space-y-6">
      {/* Поиск */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#90e0ef]/30 rounded-xl flex items-center justify-center">
          <Search className="w-5 h-5 text-[#0077b6]" />
        </div>
        <SearchBar
          placeholder="Поиск по названию или содержимому..."
          onSearch={setSearchQuery}
          className="[&_input]:pl-16 [&_input]:py-4 [&_input]:rounded-xl [&_input]:border-[#90e0ef] [&_input]:focus:border-[#0077b6] [&_input]:focus:ring-[#0077b6]/20"
        />
      </div>

      {/* Фильтр по категориям */}
      <div>
        <p className="text-sm font-semibold text-[#03045e] mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#0077b6]" />
          Категория
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge
            className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              !selectedCategory 
                ? 'bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-white shadow-md hover:shadow-lg' 
                : 'bg-[#caf0f8]/50 text-[#023e8a] hover:bg-[#ade8f4] border border-[#90e0ef]/50'
            }`}
            onClick={() => setSelectedCategory(undefined)}
          >
            Все
          </Badge>
          {Object.values(TicketCategory).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Badge
                key={cat}
                className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-white shadow-md hover:shadow-lg' 
                    : 'bg-[#caf0f8]/50 text-[#023e8a] hover:bg-[#ade8f4] border border-[#90e0ef]/50'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            );
          })}
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Список шаблонов */}
  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
    <CardHeader className="pb-4 border-b border-[#90e0ef]/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
            <LayoutList className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#03045e] flex items-center gap-2">
              Все шаблоны
              {templatesResponse && (
                <span className="text-base font-medium text-[#0077b6] bg-[#caf0f8] px-3 py-1 rounded-full">
                  {templatesResponse.meta.total}
                </span>
              )}
            </CardTitle>
          </div>
        </div>

        {/* Вид отображения */}
        <div className="hidden md:flex items-center gap-1 bg-[#caf0f8]/30 rounded-xl p-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#0077b6] bg-white shadow-sm rounded-lg px-3"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#023e8a]/50 hover:text-[#0077b6] rounded-lg px-3"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {templatesResponse?.data.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileQuestion className="w-10 h-10 text-[#0077b6]" />
          </div>
          <h3 className="text-xl font-bold text-[#03045e] mb-2">
            Шаблоны не найдены
          </h3>
          <p className="text-[#023e8a]/60 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить параметры поиска.`
              : 'Создайте первый шаблон для быстрых ответов клиентам.'
            }
          </p>
          {!searchQuery && (
            <Button
              className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать шаблон
            </Button>
          )}
        </div>
      ) : (
        <TemplateList
          templates={templatesResponse?.data || []}
          isLoading={isLoading}
          onUse={handleUseTemplate}
        />
      )}
    </CardContent>
  </Card>

  {/* Подсказка */}
  <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-[#caf0f8]/50 to-[#ade8f4]/30">
    <CardContent className="p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#48cae4]/30 rounded-xl flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-[#0077b6]" />
        </div>
        <div>
          <p className="text-sm text-[#023e8a]/80">
            <span className="font-semibold text-[#03045e]">Совет:</span> Используйте переменные в шаблонах, 
            например <code className="bg-[#caf0f8] px-1.5 py-0.5 rounded text-[#0077b6] text-xs font-mono">{'{имя_клиента}'}</code> — 
            они автоматически заменятся на реальные данные при отправке.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Модальное окно выбора шаблона */}
  {selectedTemplate && (
    <TemplateSelector
      category={selectedTemplate.category}
      onSelect={handleTemplateApply}
      onClose={() => setSelectedTemplate(null)}
    />
  )}
</div>

  );
};

export default TemplatesPage;
