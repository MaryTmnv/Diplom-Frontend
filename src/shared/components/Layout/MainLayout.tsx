import { Outlet, Link } from 'react-router-dom';
import { Header } from './Header';
import { Github, Twitter, Mail } from 'lucide-react';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header variant="public" />
      
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* О компании */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="font-bold text-xl">HelpMate</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 max-w-md">
                Современная система поддержки клиентов банка. 
                Мы помогаем решать проблемы быстро и эффективно.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="mailto:support@helpmate.ru"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Навигация */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Навигация</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link to="/knowledge-base" className="text-gray-600 hover:text-primary-600 transition-colors">
                    База знаний
                  </Link>
                </li>
                <li>
                  <Link to="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Войти
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Регистрация
                  </Link>
                </li>
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="mailto:support@helpmate.ru" className="hover:text-primary-600 transition-colors">
                    support@helpmate.ru
                  </a>
                </li>
                <li>
                  <a href="tel:88005553535" className="hover:text-primary-600 transition-colors">
                    8 (800) 555-35-35
                  </a>
                </li>
                <li className="text-gray-500">
                  Пн-Пт: 9:00 - 21:00
                </li>
                <li className="text-gray-500">
                  Сб-Вс: 10:00 - 18:00
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} HelpMate. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
