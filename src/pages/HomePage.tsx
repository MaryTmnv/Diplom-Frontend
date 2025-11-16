import { Link } from 'react-router-dom';

import { ArrowRight, MessageSquare, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui';

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Лого */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl mb-8 shadow-xl">
              <span className="text-white font-bold text-5xl">H</span>
            </div>

            {/* Заголовок */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Добро пожаловать в{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                HelpMate
              </span>
            </h1>

            {/* Подзаголовок */}
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Современная система поддержки клиентов банка. 
              Быстро, удобно, эффективно.
            </p>

            {/* CTA кнопки */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/auth/login">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl">
                  Войти в систему
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/knowledge-base">
                <Button variant="outline" size="lg" className="gap-2">
                  База знаний
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Почему HelpMate?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы создали систему, которая делает поддержку клиентов простой и эффективной
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Преимущество 1 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Быстрый ответ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Среднее время ответа — всего 15 минут
                </CardDescription>
              </CardContent>
            </Card>

            {/* Преимущество 2 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Живое общение</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time чат с операторами поддержки
                </CardDescription>
              </CardContent>
            </Card>

            {/* Преимущество 3 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Безопасность</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Защищённое хранение всех ваших данных
                </CardDescription>
              </CardContent>
            </Card>

            {/* Преимущество 4 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">24/7 доступ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  База знаний доступна круглосуточно
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Создайте аккаунт и получите доступ к полному функционалу системы
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Зарегистрироваться
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/knowledge-base">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white text-white hover:bg-white/20">
                  Посмотреть базу знаний
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Быстрые ссылки для разработки (только в dev) */}
      {import.meta.env.DEV && (
        <section className="py-8 bg-gray-100 border-t">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 mb-3 text-center">
                🔧 Быстрый доступ (только для разработки):
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Link to="/client/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    👤 Клиент
                  </Button>
                </Link>
                <Link to="/operator/queue">
                  <Button variant="outline" size="sm" className="gap-2">
                    🎧 Оператор
                  </Button>
                </Link>
                <Link to="/manager/analytics">
                  <Button variant="outline" size="sm" className="gap-2">
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
