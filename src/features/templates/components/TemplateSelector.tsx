import { useState } from 'react';
import { X, Search, FileText, Loader2, Star } from 'lucide-react';
import { Button, Input } from '@/shared/ui';
import type { Template } from '../types/template.types';
import { useTemplates } from '../hooks/useTemplate';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export const TemplateSelector = ({ onSelect, onClose }: TemplateSelectorProps) => {
  const [search, setSearch] = useState('');
  
  // Используем хук с фильтрами
  const { data, isLoading } = useTemplates({ 
    search: search || undefined,
    activeOnly: true,
    sortBy: 'popular',
    limit: 50,
  });

  const templates = data?.data || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#90e0ef]/30 bg-gradient-to-r from-[#caf0f8]/30 to-[#ade8f4]/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#03045e]">Шаблоны ответов</h3>
                <p className="text-xs text-[#023e8a]/60">
                  {templates.length} {templates.length === 1 ? 'шаблон' : 'шаблонов'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-[#023e8a]/50 hover:text-[#0077b6] hover:bg-[#caf0f8]/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-[#90e0ef]/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#023e8a]/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск шаблонов..."
                className="pl-10 border-[#90e0ef]/30 focus:border-[#0077b6]"
              />
            </div>
          </div>

          {/* Templates List */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#0077b6] animate-spin mb-3" />
                <p className="text-sm text-[#023e8a]/60">Загрузка шаблонов...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-[#caf0f8]/50 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-[#0077b6]" />
                </div>
                <h3 className="font-semibold text-[#03045e] mb-1">
                  {search ? 'Ничего не найдено' : 'Нет шаблонов'}
                </h3>
                <p className="text-sm text-[#023e8a]/60">
                  {search ? 'Попробуйте изменить запрос' : 'Шаблоны появятся позже'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className="w-full text-left p-4 rounded-xl border-2 border-[#90e0ef]/30 hover:border-[#0077b6] hover:bg-[#caf0f8]/20 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-semibold text-[#03045e] group-hover:text-[#0077b6] transition-colors">
                        {template.title}
                      </div>
                      {template.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{template.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-[#023e8a]/70 line-clamp-2 leading-relaxed mb-3">
                      {template.content}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-[#023e8a]/40">
                      <span className="px-2 py-0.5 bg-[#caf0f8]/30 rounded">
                        {template.category}
                      </span>
                      <span>Использовано: {template.usageCount} раз</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#90e0ef]/30 bg-[#caf0f8]/10">
            <p className="text-xs text-[#023e8a]/60 text-center">
              Выберите шаблон для быстрой вставки в сообщение
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
