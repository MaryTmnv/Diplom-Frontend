import { Outlet, Link } from 'react-router-dom';
import { Header } from './Header';
import { Github, Twitter, Mail, Phone, Clock } from 'lucide-react';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#caf0f8]/30 flex flex-col">
  <Header variant="public" />
  
  <main className="flex-1">
    <Outlet />
  </main>

  {/* Footer */}
  <footer className="bg-gradient-to-b from-white to-[#caf0f8]/40 border-t border-[#90e0ef]/50 mt-auto">
    <div className="container px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* О компании */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-2xl text-[#03045e] tracking-tight">HelpMate</span>
          </div>
          <p className="text-base text-[#023e8a]/70 mb-6 max-w-md leading-relaxed">
            Современная система поддержки клиентов банка. 
            Мы помогаем решать проблемы быстро и эффективно.
          </p>
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#ade8f4]/50 hover:bg-[#0077b6] text-[#0077b6] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#ade8f4]/50 hover:bg-[#0096c7] text-[#0096c7] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:support@helpmate.ru"
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#ade8f4]/50 hover:bg-[#00b4d8] text-[#00b4d8] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Навигация */}
        <div className="md:col-span-3">
          <h3 className="font-bold text-[#03045e] mb-5 text-lg">Навигация</h3>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/" 
                className="text-[#023e8a]/70 hover:text-[#0077b6] transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#48cae4] opacity-0 group-hover:opacity-100 transition-opacity" />
                Главная
              </Link>
            </li>
            <li>
              <Link 
                to="/knowledge-base" 
                className="text-[#023e8a]/70 hover:text-[#0077b6] transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#48cae4] opacity-0 group-hover:opacity-100 transition-opacity" />
                База знаний
              </Link>
            </li>
            <li>
              <Link 
                to="/auth/login" 
                className="text-[#023e8a]/70 hover:text-[#0077b6] transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#48cae4] opacity-0 group-hover:opacity-100 transition-opacity" />
                Войти
              </Link>
            </li>
            <li>
              <Link 
                to="/auth/register" 
                className="text-[#023e8a]/70 hover:text-[#0077b6] transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#48cae4] opacity-0 group-hover:opacity-100 transition-opacity" />
                Регистрация
              </Link>
            </li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="md:col-span-4">
          <h3 className="font-bold text-[#03045e] mb-5 text-lg">Контакты</h3>
          <ul className="space-y-4">
            <li>
              <a 
                href="mailto:support@helpmate.ru" 
                className="flex items-center gap-3 text-[#023e8a]/70 hover:text-[#0077b6] transition-colors duration-200 group"
              >
                <span className="w-9 h-9 rounded-lg bg-[#90e0ef]/40 flex items-center justify-center group-hover:bg-[#0077b6]/10 transition-colors">
                  <Mail className="w-4 h-4 text-[#0077b6]" />
                </span>
                support@helpmate.ru
              </a>
            </li>
            <li>
              <a 
                href="tel:88005553535" 
                className="flex items-center gap-3 text-[#023e8a]/70 hover:text-[#0077b6] transition-colors duration-200 group"
              >
                <span className="w-9 h-9 rounded-lg bg-[#90e0ef]/40 flex items-center justify-center group-hover:bg-[#0077b6]/10 transition-colors">
                  <Phone className="w-4 h-4 text-[#0077b6]" />
                </span>
                8 (800) 555-35-35
              </a>
            </li>
            <li className="flex items-start gap-3 text-[#023e8a]/60 pt-2">
              <span className="w-9 h-9 rounded-lg bg-[#90e0ef]/40 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-[#0096c7]" />
              </span>
              <div className="text-sm leading-relaxed">
                <p>Пн-Пт: 9:00 – 21:00</p>
                <p>Сб-Вс: 10:00 – 18:00</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-14 pt-8 border-t border-[#90e0ef]/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#023e8a]/50">
            © {new Date().getFullYear()} HelpMate. Все права защищены.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-[#023e8a]/50 hover:text-[#0077b6] transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-[#023e8a]/50 hover:text-[#0077b6] transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>

  );
};

export default MainLayout;
