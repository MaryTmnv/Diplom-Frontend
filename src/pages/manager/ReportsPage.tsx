import { useState } from 'react';
import { Breadcrumbs } from '@/shared/components/Navigation';

import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Select, Button } from '@/shared/ui';
import { Checkbox } from '@/shared/ui/Checkbox';
import { FileText, Users, TrendingUp, Clock, CheckCircle, Calendar, Download } from 'lucide-react';
import { Label } from 'recharts';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';

type ReportType = 'tickets' | 'performance' | 'satisfaction' | 'sla';
type Period = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
type Format = 'pdf' | 'xlsx' | 'csv';

const ReportsPage = () => {
  const [reportType, setReportType] = useState<ReportType>('tickets');
  const [period, setPeriod] = useState<Period>('month');
  const [format, setFormat] = useState<Format>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleGenerateReport = () => {
    toast.success('Отчёт генерируется... Скоро начнётся загрузка');
    
    // TODO: Реализовать генерацию отчёта
    setTimeout(() => {
      toast.success('Отчёт готов!');
    }, 2000);
  };

  // Шаблоны отчётов
  const reportTemplates = [
    {
      id: 'tickets',
      title: 'Отчёт по заявкам',
      description: 'Статистика по всем заявкам за период',
      icon: FileText,
      color: 'blue',
    },
    {
      id: 'performance',
      title: 'Производительность команды',
      description: 'Детальная статистика по операторам',
      icon: Users,
      color: 'green',
    },
    {
      id: 'satisfaction',
      title: 'Удовлетворённость клиентов',
      description: 'Анализ оценок и отзывов',
      icon: TrendingUp,
      color: 'purple',
    },
    {
      id: 'sla',
      title: 'SLA метрики',
      description: 'Соблюдение временных показателей',
      icon: Clock,
      color: 'orange',
    },
  ];

  // Последние отчёты
  const recentReports = [
    {
      id: '1',
      name: 'Отчёт по заявкам - Ноябрь 2024',
      type: 'tickets',
      date: '2024-12-01',
      format: 'pdf',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Производительность команды - Q4 2024',
      type: 'performance',
      date: '2024-11-28',
      format: 'xlsx',
      size: '1.8 MB',
    },
    {
      id: '3',
      name: 'SLA метрики - Октябрь 2024',
      type: 'sla',
      date: '2024-11-15',
      format: 'pdf',
      size: '1.2 MB',
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Отчёты' }]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Отчёты</h1>
        <p className="text-gray-600 mt-1">
          Генерация и экспорт аналитических отчётов
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - Генератор отчётов */}
        <div className="lg:col-span-2 space-y-6">
          {/* Выбор типа отчёта */}
          <Card>
            <CardHeader>
              <CardTitle>Выберите тип отчёта</CardTitle>
              <CardDescription>
                Выберите шаблон для генерации отчёта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = reportType === template.id;
                  
                  return (
                    <button
                      key={template.id}
                      onClick={() => setReportType(template.id as ReportType)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${template.color}-100`}>
                          <Icon className={`w-5 h-5 text-${template.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {template.title}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {template.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Настройки отчёта */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки отчёта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Период */}
              <div className="space-y-2">
                <Label>Период</Label>
                <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Сегодня</SelectItem>
                    <SelectItem value="week">Неделя</SelectItem>
                    <SelectItem value="month">Месяц</SelectItem>
                    <SelectItem value="quarter">Квартал</SelectItem>
                    <SelectItem value="year">Год</SelectItem>
                    <SelectItem value="custom">Произвольный период</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Формат */}
              <div className="space-y-2">
                <Label>Формат экспорта</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as Format)}>
                  <SelectTrigger>
                    <FileText className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF документ</SelectItem>
                    <SelectItem value="xlsx">Excel таблица</SelectItem>
                    <SelectItem value="csv">CSV файл</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Дополнительные опции */}
              <div className="space-y-3">
                <Label>Дополнительно</Label>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeCharts"
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(!!checked)}
                  />
                  <Label className="cursor-pointer font-normal">
                    Включить графики и диаграммы
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeDetails"
                    checked={includeDetails}
                    onCheckedChange={(checked) => setIncludeDetails(!!checked)}
                  />
                  <Label className="cursor-pointer font-normal">
                    Включить детальную информацию
                  </Label>
                </div>
              </div>

              {/* Кнопка генерации */}
              <Button 
                onClick={handleGenerateReport}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Сгенерировать отчёт
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - Последние отчёты */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Последние отчёты</CardTitle>
              <CardDescription>
                Ранее сгенерированные отчёты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {report.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(report.date).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 uppercase">
                          {report.format}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {report.size}
                        </span>
                      </div>
                    </div>

                    <Button size="icon" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {recentReports.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-gray-600">
                    Нет сгенерированных отчётов
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
