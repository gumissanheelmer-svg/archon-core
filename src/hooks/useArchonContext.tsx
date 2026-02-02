import { createContext, useContext, useState, ReactNode } from "react";

export interface ActionItem {
  acao: string;
  prioridade: "alta" | "media" | "baixa";
}

export interface ArchonResponse {
  archon_sintese: string;
  akira_estrategia: string;
  maya_conteudo: string;
  chen_dados: string;
  yuki_psicologia: string;
  plano_de_acao: ActionItem[];
}

export interface ArchonContext {
  objeto_em_analise: string;
  objetivo_atual: string;
  horizonte: "curto" | "medio" | "longo";
}

interface ArchonContextType {
  context: ArchonContext | null;
  setContext: (ctx: ArchonContext) => void;
  response: ArchonResponse | null;
  setResponse: (res: ArchonResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearSession: () => void;
}

const ArchonContextProvider = createContext<ArchonContextType | undefined>(undefined);

export const ArchonProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState<ArchonContext | null>(null);
  const [response, setResponse] = useState<ArchonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearSession = () => {
    setContext(null);
    setResponse(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <ArchonContextProvider.Provider
      value={{
        context,
        setContext,
        response,
        setResponse,
        isLoading,
        setIsLoading,
        error,
        setError,
        clearSession,
      }}
    >
      {children}
    </ArchonContextProvider.Provider>
  );
};

export const useArchonContext = () => {
  const ctx = useContext(ArchonContextProvider);
  if (ctx === undefined) {
    throw new Error("useArchonContext must be used within an ArchonProvider");
  }
  return ctx;
};
