import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="public" />
      
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* О компании */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">HelpMate</h3>
              <p className="text-sm text-gray-600">
                Современная система поддержки клиентов банка
              </p>
            </div>

            {/* Быстрые ссылки */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Навигация</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Главная
                  </a>
                </li>
                <li>
                  <a href="/knowledge-base" className="text-gray-600 hover:text-primary-600 transition-colors">
                    База знаний
                  </a>
                </li>
              </ul>
            </div>

            {/* Помощь */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Помощь</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Войти
                  </a>
                </li>
                <li>
                  <a href="/auth/register" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Регистрация
                  </a>
                </li>
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Контакты</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>support@helpmate.ru</li>
                <li>8 (800) 555-35-35</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            © 2025 HelpMate. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};
