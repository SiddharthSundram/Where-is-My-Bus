"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { MiniLoadingBus } from "./loading-3d-bus";
import { useState } from "react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  showLoader?: boolean;
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  showLoader = true,
  disabled,
  ...props
}: LoadingButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      const onClick = props.onClick as any;
      if (typeof onClick === 'function') {
        setIsPending(true);
        try {
          await onClick(e);
        } finally {
          setIsPending(false);
        }
      }
    }
  };

  const isLoadingState = loading || isPending;
  const isDisabled = disabled || isLoadingState;

  return (
    <Button
      {...props}
      disabled={isDisabled}
      onClick={handleClick}
      className="relative overflow-hidden"
    >
      <span className={`transition-opacity duration-200 ${isLoadingState ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      
      {isLoadingState && showLoader && (
        <span className="absolute inset-0 flex items-center justify-center">
          <MiniLoadingBus />
        </span>
      )}
    </Button>
  );
}

// Async version for promises
interface AsyncLoadingButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void> | Promise<any>;
  loadingText?: string;
  children: React.ReactNode;
  showLoader?: boolean;
  onError?: (error: any) => void;
  onSuccess?: (result: any) => void;
}

export function AsyncLoadingButton({
  onClick,
  loadingText,
  children,
  showLoader = true,
  onError,
  onSuccess,
  ...props
}: AsyncLoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await onClick();
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
      console.error('AsyncLoadingButton error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      {...props}
      loading={isLoading}
      loadingText={loadingText}
      showLoader={showLoader}
      onClick={handleClick}
    >
      {children}
    </LoadingButton>
  );
}