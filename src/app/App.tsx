import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import '@/styles/globals.css';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
