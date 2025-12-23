const issues = [
  { title: 'Не могу войти в приложение', count: 28, percentage: 18 },
  { title: 'Ошибка при оплате картой', count: 22, percentage: 14 },
  { title: 'Не приходит SMS-код', count: 19, percentage: 12 },
  { title: 'Заблокирована карта', count: 15, percentage: 10 },
  { title: 'Вопрос по комиссии', count: 12, percentage: 8 },
];

export const TopIssues = () => {
  return (
    <div className="space-y-4">
      {issues.map((issue, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate pr-4">
              {issue.title}
            </p>
            <span className="text-sm font-bold text-gray-900 shrink-0">
              {issue.count}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${issue.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
