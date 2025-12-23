import { Button } from "@/shared/ui";
import { AlertTriangle, Code, ChevronDown, RotateCcw, Home, HelpCircle } from "lucide-react";
import { type ReactNode, Component, type ErrorInfo } from "react";


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
    
    // Здесь можно отправить ошибку в Sentry
    // if (env.isProd) {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Кастомный fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Дефолтный fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#caf0f8]/20 to-white px-4">
  <div className="max-w-md w-full text-center">
    {/* Icon */}
    <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
      <AlertTriangle className="w-12 h-12 text-red-500" />
    </div>
    
    {/* Title */}
    <h1 className="text-3xl font-bold text-[#03045e] mb-3">
      Что-то пошло не так
    </h1>
    
    {/* Description */}
    <p className="text-[#023e8a]/70 text-lg mb-8 leading-relaxed">
      Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
    </p>

    {/* Error Details */}
    {this.state.error && (
      <details className="mb-8 text-left">
        <summary className="cursor-pointer text-sm font-medium text-[#0077b6] hover:text-[#023e8a] flex items-center justify-center gap-2 p-3 bg-[#caf0f8]/30 rounded-xl transition-colors">
          <Code className="w-4 h-4" />
          Технические детали
          <ChevronDown className="w-4 h-4" />
        </summary>
        <div className="mt-3 p-4 bg-[#caf0f8]/20 border border-[#90e0ef]/30 rounded-xl">
          <pre className="text-xs text-[#03045e] overflow-auto max-h-60 font-mono">
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      </details>
    )}

    {/* Actions */}
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button
        onClick={this.handleReset}
        variant="outline"
        className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-xl transition-all gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Попробовать снова
      </Button>
      
      <Button
        onClick={() => window.location.href = '/'}
        className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300 gap-2"
      >
        <Home className="w-4 h-4" />
        На главную
      </Button>
    </div>

    {/* Additional Help */}
    <div className="mt-8 p-4 bg-[#caf0f8]/20 rounded-xl">
      <p className="text-xs text-[#023e8a]/60 mb-2">
        Если проблема повторяется, свяжитесь с поддержкой
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.location.href = '/support'}
        className="text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg text-xs gap-1"
      >
        <HelpCircle className="w-3 h-3" />
        Связаться с поддержкой
      </Button>
    </div>
  </div>
</div>

      );
    }

    return this.props.children;
  }
}
