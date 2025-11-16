import { useState } from 'react';
import { Template } from '../types/template.types';
import { TemplateCard } from './TemplateCard';
import { SearchBar } from '@/shared/components/SearchBar';
import { EmptyState } from '@/shared/components/EmptyState';
import { X, FileText } from 'lucide-react';
import { useTemplatesByCategory, useUseTemplate } from '../hooks/useTemplate';
import { Button, Label, Input } from '@/shared/ui';

interface TemplateSelectorProps {
  category?: string;
  onSelect: (content: string) => void;
  onClose: () => void;
}

export const TemplateSelector = ({ category, onSelect, onClose }: TemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { data: templates = [], isLoading } = useTemplatesByCategory(category || 'OTHER');
  const { mutate: useTemplate, isPending } = useUseTemplate();

  // Фильтрация по поиску
  const filteredTemplates = templates.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    
    // Инициализируем переменные
    const initialVars: Record<string, string> = {};
    template.variables.forEach((v) => {
      initialVars[v] = '';
    });
    setVariables(initialVars);
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;

    // Проверяем что все переменные заполнены
    const emptyVars = selectedTemplate.variables.filter((v) => !variables[v]?.trim());
    if (emptyVars.length > 0) {
      alert(`Заполните переменные: ${emptyVars.join(', ')}`);
      return;
    }

    useTemplate(
      {
        id: selectedTemplate.id,
        data: { variables },
      },
      {
        onSuccess: (response) => {
          onSelect(response.content);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Шаблоны ответов</h2>
            <p className="text-sm text-gray-600 mt-1">
              Выберите шаблон и заполните переменные
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedTemplate ? (
            // Форма заполнения переменных
            <div className="space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTemplate(null)}
              >
                ← Назад к списку
              </Button>

              <div className="card">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {selectedTemplate.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 font-mono bg-gray-50 p-3 rounded">
                  {selectedTemplate.content}
                </p>

                {/* Форма переменных */}
                {selectedTemplate.variables.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Заполните переменные:
                    </h4>
                    {selectedTemplate.variables.map((variable) => (
                      <div key={variable} className="space-y-2">
                        <Label htmlFor={variable} className="label-required">
                          {variable}
                        </Label>
                        <Input
                          id={variable}
                          value={variables[variable] || ''}
                          onChange={(e) =>
                            setVariables((prev) => ({
                              ...prev,
                              [variable]: e.target.value,
                            }))
                          }
                          placeholder={`Введите ${variable}...`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Превью */}
                {Object.keys(variables).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Превью:</h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedTemplate.content.replace(
                          /\{(\w+)\}/g,
                          (match, varName) => variables[varName] || match
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Список шаблонов
            <div className="space-y-6">
              {/* Поиск */}
              <SearchBar
                placeholder="Поиск по шаблонам..."
                onSearch={setSearchQuery}
              />

              {/* Список */}
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Загрузка шаблонов...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <EmptyState
                  icon={<FileText className="w-16 h-16" />}
                  title="Шаблоны не найдены"
                  description="Попробуйте изменить поисковый запрос"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onUse={() => handleTemplateSelect(template)}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedTemplate && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
              Отмена
            </Button>
            <Button onClick={handleUseTemplate} disabled={isPending}>
              {isPending ? 'Применение...' : 'Использовать шаблон'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
