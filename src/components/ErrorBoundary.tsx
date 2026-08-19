import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Sanctuary error boundary caught:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070509] text-[#fdf2f8] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-[#160718] border-2 border-pink-400 rounded-3xl p-8 shadow-[0_0_40px_rgba(244,114,182,0.35)]">
            <div className="text-5xl mb-4">👑✨</div>
            <h2 className="text-2xl font-bold text-pink-200 mb-2">
              Hanna's Sanctuary
            </h2>
            <p className="text-sm text-pink-300/90 mb-6 leading-relaxed">
              Preparing your royal celebration... Tap below to enter.
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch {
                  // ignore
                }
                window.location.reload();
              }}
              className="bg-gradient-to-r from-pink-400 to-rose-300 text-black font-bold px-6 py-3 rounded-2xl shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Enter Sanctuary 🌸
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
