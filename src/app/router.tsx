import { createBrowserRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

// eslint-disable-next-line react-refresh/only-export-components
const StyleTestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            🎨 HelpMate Style Guide
          </h1>
          <p className="text-gray-600">Проверка всех стилей</p>
        </div>

        {/* Кнопки */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Кнопки</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-ghost">Ghost Button</button>
            <button className="btn-danger">Danger Button</button>
            <button className="btn-primary" disabled>Disabled</button>
          </div>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="font-semibold mb-2">Обычная карточка</h3>
            <p className="text-sm text-gray-600">Базовая карточка без эффектов</p>
          </div>
          <div className="card-hover">
            <h3 className="font-semibold mb-2">Hover карточка</h3>
            <p className="text-sm text-gray-600">Наведи мышку</p>
          </div>
          <div className="card-interactive">
            <h3 className="font-semibold mb-2">Интерактивная</h3>
            <p className="text-sm text-gray-600">Кликабельная карточка</p>
          </div>
        </div>

        {/* Бейджи статусов */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Статусы заявок</h2>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-status-new">Новая</span>
            <span className="badge badge-status-in-progress">В работе</span>
            <span className="badge badge-status-waiting">Ожидание</span>
            <span className="badge badge-status-resolved">Решена</span>
            <span className="badge badge-status-closed">Закрыта</span>
          </div>
        </div>

        {/* Бейджи приоритетов */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Приоритеты</h2>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-priority-low">🟢 Низкий</span>
            <span className="badge badge-priority-medium">🟡 Средний</span>
            <span className="badge badge-priority-high">🟠 Высокий</span>
            <span className="badge badge-priority-critical">🔴 Критический</span>
          </div>
        </div>
        {/* Формы */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Элементы форм</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="label label-required">Пароль</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="label">С ошибкой</label>
              <input 
                type="text" 
                className="input-field input-error" 
                placeholder="Неверное значение"
              />
              <p className="error-message">Это поле обязательно для заполнения</p>
            </div>
            <div>
              <label className="label">Отключено</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Недоступно"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Скелетоны */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Skeleton Loaders</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="skeleton-avatar"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>

        {/* Toast тесты */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Уведомления (Toast)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={() => toast.success('Успешно сохранено!')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              ✅ Success
            </button>
            <button 
              onClick={() => toast.error('Произошла ошибка')}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              ❌ Error
            </button>
            <button 
              onClick={() => toast.loading('Загрузка...')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              ⏳ Loading
            </button>
            <button 
              onClick={() => toast('Обычное уведомление', { icon: '💡' })}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              💡 Info
            </button>
          </div>
        </div>
        {/* Цветовая палитра */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Цветовая палитра</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Primary (Индиго)</p>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-primary-100 rounded"></div>
                <div className="w-12 h-12 bg-primary-300 rounded"></div>
                <div className="w-12 h-12 bg-primary-500 rounded"></div>
                <div className="w-12 h-12 bg-primary-600 rounded"></div>
                <div className="w-12 h-12 bg-primary-700 rounded"></div>
                <div className="w-12 h-12 bg-primary-900 rounded"></div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Accent (Янтарный)</p>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-accent-100 rounded"></div>
                <div className="w-12 h-12 bg-accent-300 rounded"></div>
                <div className="w-12 h-12 bg-accent-500 rounded"></div>
                <div className="w-12 h-12 bg-accent-600 rounded"></div>
                <div className="w-12 h-12 bg-accent-700 rounded"></div>
                <div className="w-12 h-12 bg-accent-900 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Анимации */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Анимации</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary-100 rounded-lg animate-fade-in">
              Fade In
            </div>
            <div className="p-4 bg-blue-100 rounded-lg animate-slide-up">
              Slide Up
            </div>
            <div className="p-4 bg-purple-100 rounded-lg animate-slide-down">
              Slide Down
            </div>
            <div className="p-4 bg-pink-100 rounded-lg animate-pulse">
              Pulse
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            ✅ Все стили работают корректно
          </p>
        </div>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StyleTestPage />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
          <p className="text-gray-600 mb-4">Страница не найдена</p>
          <a href="/" className="btn-primary">
            На главную
          </a>
        </div>
      </div>
    ),
  },
]);