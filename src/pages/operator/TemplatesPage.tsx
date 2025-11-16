import { useState } from 'react';
import { Breadcrumbs } from '@/shared/components/Navigation';
import { SearchBar } from '@/shared/components/SearchBar';
import { TemplateCard } from '@/features/templates/components/TemplateCard';
import { TemplateList } from '@/features/templates/components/TemplateList';
import { TemplateSelector } from '@/features/templates/components/TemplateSelector';
import { useTemplates, usePopularTemplates } from '@/features/templates/hooks/useTemplate';
import { Template } from '@/features/templates/types/template.types';
import { TicketCategory } from '@/features/tickets/types/tickets.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';
import { Sparkles, Badge } from 'lucide-react';

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
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Шаблоны ответов' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Шаблоны ответов</h1>
        <p className="text-gray-600 mt-1">
          Готовые ответы для быстрой работы с клиентами
        </p>
      </div>

      {/* Популярные шаблоны */}
      {popularTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <CardTitle>Популярные шаблоны</CardTitle>
            </div>
            <CardDescription>Самые используемые шаблоны</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => handleUseTemplate(template)}
                  compact
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Поиск и фильтры */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Поиск */}
          <SearchBar
            placeholder="Поиск по названию или содержимому..."
            onSearch={setSearchQuery}
          />

          {/* Фильтр по категориям */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Категория:</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                // variant={!selectedCategory ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(undefined)}
              >
                Все
              </Badge>
              {Object.values(TicketCategory).map((cat) => (
                <Badge
                  key={cat}
                //   variant={selectedCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список шаблонов */}
      <Card>
        <CardHeader>
          <CardTitle>
            Все шаблоны
            {templatesResponse && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({templatesResponse.meta.total})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateList
            templates={templatesResponse?.data || []}
            isLoading={isLoading}
            onUse={handleUseTemplate}
          />
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
