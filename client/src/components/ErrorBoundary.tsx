import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Component, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-slate-50">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="bg-red-100 p-4 rounded-full mb-6">
              <AlertTriangle
                size={48}
                className="text-red-600 flex-shrink-0"
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Ops! Algo deu errado.</h2>
            <p className="text-slate-600 text-center mb-8">
              Ocorreu um erro inesperado na aplicação. Nossa equipe técnica já foi notificada.
            </p>

            <div className="p-4 w-full rounded-lg bg-slate-900 overflow-auto mb-8 max-h-48">
              <pre className="text-xs text-slate-300 whitespace-break-spaces font-mono">
                {this.state.error?.message || "Erro desconhecido"}
                {"\n\n"}
                {this.state.error?.stack}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RotateCcw size={16} />
                Tentar Novamente
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="gap-2"
              >
                <Home size={16} />
                Voltar para o Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
