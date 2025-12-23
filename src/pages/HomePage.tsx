import { Link } from 'react-router-dom';

import { ArrowRight, MessageSquare, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui';

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)]">
  {/* Hero Section */}
  <section className="relative overflow-hidden bg-gradient-to-br from-[#caf0f8] via-[#ade8f4] to-[#90e0ef] py-24">
    <div className="container mx-auto px-4">
      <div className="w-full max-w-4xl mx-auto text-center relative z-10">
        {/* Лого */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-[2rem] shadow-2xl ring-4 ring-white/30">
            <span className="text-white font-bold text-6xl tracking-tight">H</span>
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#03045e] mb-8 leading-[1.1] tracking-tight">
          Добро пожаловать в{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077b6] via-[#0096c7] to-[#00b4d8]">
            HelpMate
          </span>
        </h1>

        {/* Подзаголовок */}
        <p className="text-xl md:text-2xl text-[#023e8a]/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Современная система поддержки клиентов банка. 
          Быстро, удобно, эффективно.
        </p>

        {/* CTA кнопки */}
        <div className="flex gap-5 justify-center flex-wrap">
          <Link to="/auth/login">
            <Button 
              size="lg" 
              className="gap-3 px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
            >
              Войти в систему
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/knowledge-base">
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-3 px-8 py-6 text-lg font-semibold border-2 border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-2xl transition-all duration-300"
            >
              База знаний
            </Button>
          </Link>
        </div>
      </div>
    </div>

    {/* Декоративные элементы — симметричное расположение */}
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#48cae4] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob pointer-events-none" />
    <div className="absolute -top-10 -right-20 w-96 h-96 bg-[#00b4d8] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 pointer-events-none" />
    <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#90e0ef] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none" />
  </section>

  {/* Преимущества */}
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-2 bg-[#caf0f8] text-[#0077b6] text-sm font-semibold rounded-full mb-4">
          Наши преимущества
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-[#03045e] mb-6">
          Почему HelpMate?
        </h2>
        <p className="text-[#023e8a]/70 text-lg max-w-2xl mx-auto leading-relaxed">
          Мы создали систему, которая делает поддержку клиентов простой и эффективной
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Преимущество 1 */}
        <Card className="text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-[#caf0f8]/20 rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 pt-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Быстрый ответ</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <CardDescription className="text-[#023e8a]/70 text-base leading-relaxed">
              Среднее время ответа — всего 15 минут
            </CardDescription>
          </CardContent>
        </Card>

        {/* Преимущество 2 */}
        <Card className="text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-[#caf0f8]/20 rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 pt-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Живое общение</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <CardDescription className="text-[#023e8a]/70 text-base leading-relaxed">
              Real-time чат с операторами поддержки
            </CardDescription>
          </CardContent>
        </Card>

        {/* Преимущество 3 */}
        <Card className="text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-[#caf0f8]/20 rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 pt-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0096c7] to-[#023e8a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-[#03045e]">Безопасность</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <CardDescription className="text-[#023e8a]/70 text-base leading-relaxed">
              Защищённое хранение всех ваших данных
            </CardDescription>
          </CardContent>
        </Card>

        {/* Преимущество 4 */}
        <Card className="text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-[#caf0f8]/20 rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 pt-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-[#03045e]">24/7 доступ</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <CardDescription className="text-[#023e8a]/70 text-base leading-relaxed">
              База знаний доступна круглосуточно
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>

  {/* CTA секция */}
  <section className="py-24 bg-gradient-to-br from-[#03045e] via-[#023e8a] to-[#0077b6] relative overflow-hidden">
    {/* Декоративный паттерн — симметричный */}
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
      <div className="absolute bottom-10 right-10 w-40 h-40 border border-white rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-white rounded-full" />
      <div className="absolute top-20 right-1/4 w-20 h-20 border border-white rounded-full" />
      <div className="absolute bottom-20 left-1/4 w-20 h-20 border border-white rounded-full" />
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
          Готовы начать?
        </h2>
        <p className="text-xl md:text-2xl mb-10 text-[#90e0ef] leading-relaxed">
          Создайте аккаунт и получите доступ к полному функционалу системы
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          <Link to="/auth/register">
            <Button 
              size="lg" 
              className="gap-3 px-8 py-6 text-lg font-semibold bg-white text-[#03045e] hover:bg-[#caf0f8] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
            >
              Зарегистрироваться
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/knowledge-base">
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-3 px-8 py-6 text-lg font-semibold bg-transparent border-2 border-[#48cae4] text-[#48cae4] hover:bg-[#48cae4]/20 rounded-2xl transition-all duration-300"
            >
              Посмотреть базу знаний
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>

  {/* Быстрые ссылки для разработки (только в dev) */}
  {import.meta.env.DEV && (
    <section className="py-6 bg-[#caf0f8]/50 border-t border-[#90e0ef]">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#0077b6] mb-4 font-medium">
            🔧 Быстрый доступ (только для разработки):
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/client/dashboard">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-[#0096c7] text-[#0096c7] hover:bg-[#0096c7] hover:text-white rounded-xl transition-all"
              >
                👤 Клиент
              </Button>
            </Link>
            <Link to="/operator/queue">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-xl transition-all"
              >
                🎧 Оператор
              </Button>
            </Link>
            <Link to="/manager/analytics">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-[#023e8a] text-[#023e8a] hover:bg-[#023e8a] hover:text-white rounded-xl transition-all"
              >
                📊 Руководитель
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )}
</div>


  );
};

export default HomePage;
