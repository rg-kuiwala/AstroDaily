import React, { Component, ErrorInfo, ReactNode } from "react";

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
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-mystic-950 p-6 text-center">
          <div className="glass p-8 max-w-md space-y-4">
            <h1 className="text-2xl font-serif gold-text">Something went wrong</h1>
            <p className="text-sm opacity-60">
              The app encountered an error. Please try refreshing the page.
            </p>
            <pre className="text-[10px] bg-black/40 p-4 rounded-lg overflow-auto text-left text-red-400 max-h-40">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gold text-mystic-900 rounded-full font-bold text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
