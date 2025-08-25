"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Loading3DBus, PageTransitionLoader } from "./loading-3d-bus";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showPageLoader: (text?: string) => void;
  hidePageLoader: () => void;
  showInlineLoader: (text?: string) => void;
  hideInlineLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState<{ show: boolean; text?: string }>({ show: false, text: undefined });
  const [inlineLoader, setInlineLoader] = useState<{ show: boolean; text?: string }>({ show: false, text: undefined });

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const showPageLoader = (text?: string) => {
    setPageLoader({ show: true, text });
  };

  const hidePageLoader = () => {
    setPageLoader({ show: false, text: undefined });
  };

  const showInlineLoader = (text?: string) => {
    setInlineLoader({ show: true, text });
  };

  const hideInlineLoader = () => {
    setInlineLoader({ show: false, text: undefined });
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        showPageLoader,
        hidePageLoader,
        showInlineLoader,
        hideInlineLoader,
      }}
    >
      {children}
      
      {/* Global Page Loader */}
      {pageLoader.show && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loading3DBus 
            size="lg" 
            text={pageLoader.text || "Loading..."} 
            showProgress={true}
            fullScreen={false}
          />
        </div>
      )}

      {/* Inline Loader */}
      {inlineLoader.show && (
        <div className="fixed bottom-8 right-8 z-40">
          <div className="bg-card border rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <div className="w-6 h-6">
              <div className="animate-3d-bus-spin transform-style-3d">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-blue-500 rounded flex items-center justify-center transform translate-z-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {inlineLoader.text || "Processing..."}
            </span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

// Hook for page-level loading
export function usePageLoader() {
  const { showPageLoader, hidePageLoader } = useLoading();
  
  const withLoading = async <T,>(
    asyncFunction: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      showPageLoader(loadingText);
      const result = await asyncFunction();
      return result;
    } finally {
      hidePageLoader();
    }
  };

  return { showPageLoader, hidePageLoader, withLoading };
}

// Hook for inline loading
export function useInlineLoader() {
  const { showInlineLoader, hideInlineLoader } = useLoading();
  
  const withInlineLoading = async <T,>(
    asyncFunction: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      showInlineLoader(loadingText);
      const result = await asyncFunction();
      return result;
    } finally {
      hideInlineLoader();
    }
  };

  return { showInlineLoader, hideInlineLoader, withInlineLoading };
}