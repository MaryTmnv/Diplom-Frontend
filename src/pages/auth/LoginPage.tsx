import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';

function LoginPage (){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <CardTitle className="text-2xl">Вход в HelpMate</CardTitle>
          <CardDescription>
            Введите ваши данные для входа в систему
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage