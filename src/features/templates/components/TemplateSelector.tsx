import { useState } from 'react';
import { Template } from '../types/template.types';
import { TemplateCard } from './TemplateCard';
import { SearchBar } from '@/shared/components/SearchBar';
import { EmptyState } from '@/shared/components/EmptyState';
import { X, FileText, ArrowLeft, Check, Edit3, Eye, Hash, Loader2, Search } from 'lucide-react';
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
    <div className="fixed inset-0 bg-[#03045e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
  <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scale-in overflow-hidden border-2 border-[#90e0ef]/30">
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-[#90e0ef]/30 bg-gradient-to-r from-[#03045e] to-[#023e8a]">
      <div>
        <h2 className="text-2xl font-bold text-white">Шаблоны ответов</h2>
        <p className="text-sm text-[#90e0ef] mt-1">
          Выберите шаблон и заполните переменные
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onClose}
        className="text-white hover:bg-white/10 rounded-xl transition-all"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-[#caf0f8]/10">
      {selectedTemplate ? (
        // Форма заполнения переменных
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTemplate(null)}
            className="text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Button>

          <div className="p-6 rounded-2xl border-2 border-[#90e0ef]/30 bg-white shadow-lg">
            {/* Template info */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#90e0ef]/30">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-[#03045e] mb-2">
                  {selectedTemplate.title}
                </h3>
                <div className="p-4 bg-[#caf0f8]/20 rounded-xl border border-[#90e0ef]/30">
                  <p className="text-sm text-[#03045e] font-mono leading-relaxed">
                    {selectedTemplate.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Форма переменных */}
            {selectedTemplate.variables.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#90e0ef]/30 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-[#0077b6]" />
                  </div>
                  <h4 className="font-bold text-[#03045e]">
                    Заполните переменные
                  </h4>
                </div>

                {selectedTemplate.variables.map((variable) => (
                  <div key={variable} className="space-y-2">
                    <Label 
                      htmlFor={variable} 
                      className="label-required text-[#03045e] font-medium flex items-center gap-2"
                    >
                      <Hash className="w-3 h-3 text-[#0077b6]" />
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
                      className="rounded-xl border-[#90e0ef] focus:border-[#0077b6] focus:ring-[#0077b6]/20 transition-all"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Превью */}
            {Object.keys(variables).length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#90e0ef]/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#48cae4]/30 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-[#0077b6]" />
                  </div>
                  <h4 className="font-bold text-[#03045e]">Превью результата</h4>
                </div>
                <div className="p-5 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 border border-[#48cae4]/30 rounded-xl">
                  <p className="text-sm text-[#03045e] whitespace-pre-wrap leading-relaxed">
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
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#90e0ef]/30 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-[#0077b6]" />
            </div>
            <SearchBar
              placeholder="Поиск по шаблонам..."
              onSearch={setSearchQuery}
              className="[&_input]:pl-16 [&_input]:py-4 [&_input]:rounded-xl [&_input]:border-[#90e0ef] [&_input]:focus:border-[#0077b6] [&_input]:focus:ring-[#0077b6]/20"
            />
          </div>

          {/* Список */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Loader2 className="w-8 h-8 text-[#0077b6] animate-spin" />
              </div>
              <p className="text-[#023e8a]/60">Загрузка шаблонов...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileText className="w-10 h-10 text-[#0077b6]" />
              </div>
              <h3 className="text-xl font-bold text-[#03045e] mb-2">
                Шаблоны не найдены
              </h3>
              <p className="text-[#023e8a]/60 max-w-md mx-auto">
                Попробуйте изменить поисковый запрос
              </p>
            </div>
          ) : (
            <>
              {/* Счётчик */}
              <div className="flex items-center justify-between px-2">
                <p className="text-sm text-[#023e8a]/50 font-medium">
                  Найдено: {filteredTemplates.length}
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TemplateCard
                      template={template}
                      onUse={() => handleTemplateSelect(template)}
                      compact
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>

    {/* Footer */}
    {selectedTemplate && (
      <div className="flex items-center justify-between gap-4 p-6 border-t border-[#90e0ef]/30 bg-[#caf0f8]/10">
        {/* Индикатор заполнения */}
        <div className="flex items-center gap-2 text-sm">
          {selectedTemplate.variables.length > 0 && (
            <>
              <div className="w-32 h-2 bg-[#90e0ef]/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0077b6] to-[#00b4d8] transition-all duration-300"
                  style={{ 
                    width: `${(Object.keys(variables).filter(k => variables[k]).length / selectedTemplate.variables.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-[#023e8a]/60 font-medium">
                {Object.keys(variables).filter(k => variables[k]).length} / {selectedTemplate.variables.length}
              </span>
            </>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTemplate(null)}
            className="text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-xl"
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUseTemplate} 
            disabled={isPending || (selectedTemplate.variables.length > 0 && Object.keys(variables).filter(k => variables[k]).length < selectedTemplate.variables.length)}
            className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Применение...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Использовать шаблон
              </>
            )}
          </Button>
        </div>
      </div>
    )}
  </div>
</div>

  );
};
