// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import { Component, ErrorInfo, ReactNode } from 'react';

// Icons
import { AlertTriangle, RefreshCcw } from 'lucide-react';

// Components - UI
import { Button } from '../ui';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white dark:bg-ink-surface border border-cream-border dark:border-ink-border rounded-xl shadow-sm my-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
            An unexpected error occurred. We've been notified and are working on it.
            {this.state.error && (
              <span className="block mt-2 text-sm font-mono bg-gray-50 dark:bg-black/20 p-2 rounded border border-gray-200 dark:border-gray-800 break-all">
                {this.state.error.message}
              </span>
            )}
          </p>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCcw className="w-4 h-4" />}
            >
              Reload Page
            </Button>
            <Button
              variant="primary"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


export default ErrorBoundary;
