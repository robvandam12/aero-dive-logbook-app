
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const NavigationLoader = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Simular carga mínima

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return <>{children}</>;
};
