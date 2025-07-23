import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-heading font-black text-primary">404</h1>
        <h2 className="text-3xl font-heading font-bold text-foreground">Página Não Encontrada</h2>
        <p className="text-xl text-muted-foreground">A página que você procura não existe ou foi removida</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
