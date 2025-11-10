import { createContext, useContext, ReactNode } from 'react';

interface ExampleContextType {
  exampleValue: string;
}

const ExampleContext = createContext<ExampleContextType | undefined>(undefined);

export const ExampleProvider = ({ children }: { children: ReactNode }) => {
  const exampleValue = 'Exemplo de contexto';

  return (
    <ExampleContext.Provider value={{ exampleValue }}>
      {children}
    </ExampleContext.Provider>
  );
};

export const useExampleContext = () => {
  const context = useContext(ExampleContext);
  if (context === undefined) {
    throw new Error('useExampleContext deve ser usado dentro de ExampleProvider');
  }
  return context;
};

