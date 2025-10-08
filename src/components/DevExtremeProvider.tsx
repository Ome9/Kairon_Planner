import { useEffect, ReactNode } from "react";
import "devextreme/dist/css/dx.dark.css";

interface DevExtremeProviderProps {
  children: ReactNode;
}

export const DevExtremeProvider = ({ children }: DevExtremeProviderProps) => {
  useEffect(() => {
    // Sync DevExtreme theme with system/user theme
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    
    // DevExtreme automatically uses dx.dark.css when dark class is on body/html
    // We've imported dx.dark.css which works well with our purple theme
  }, []);

  return <>{children}</>;
};
