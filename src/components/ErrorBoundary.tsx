import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    // Always guarantee loading screen is dismissed even if error occurred during initial mount
    if (typeof window !== 'undefined' && typeof (window as any).dismissLoadingScreen === 'function') {
      try {
        (window as any).dismissLoadingScreen();
      } catch {
        // ignore
      }
    }
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = './';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#0d1322] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="font-gaming text-xl font-bold text-white tracking-wide">
              Something went wrong loading this view
            </h2>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              An unexpected error occurred. The rest of the Akwasi Unblocked Games portal is still available.
            </p>

            {this.state.error && (
              <pre className="p-2.5 bg-slate-950/80 rounded-lg text-[11px] text-rose-300 font-mono text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-gaming font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Portal</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-gaming font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Homepage</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
