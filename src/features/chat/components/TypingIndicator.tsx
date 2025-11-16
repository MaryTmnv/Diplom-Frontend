interface TypingIndicatorProps {
  userName: string;
}

export const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 animate-fade-in">
      <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
        <div className="flex gap-1">
          <span 
            className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms', animationDuration: '1s' }} 
          />
          <span 
            className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" 
            style={{ animationDelay: '150ms', animationDuration: '1s' }} 
          />
          <span 
            className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" 
            style={{ animationDelay: '300ms', animationDuration: '1s' }} 
          />
        </div>
      </div>
      <span className="text-sm text-gray-600 italic">
        {userName} печатает...
      </span>
    </div>
  );
};
