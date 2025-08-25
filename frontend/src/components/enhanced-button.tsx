"use client";

import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EnhancedButtonProps extends ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium' | 'glow' | 'shimmer' | '3d' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
  glowEffect?: boolean;
  shimmerEffect?: boolean;
  hover3D?: boolean;
  pulseEffect?: boolean;
  gradientType?: 'primary' | 'secondary' | 'rainbow' | 'sunset' | 'ocean';
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    children,
    className,
    variant = 'default',
    size = 'default',
    loading = false,
    icon,
    iconPosition = 'left',
    ripple = true,
    glowEffect = false,
    shimmerEffect = false,
    hover3D = true,
    pulseEffect = false,
    gradientType = 'primary',
    disabled,
    onClick,
    ...props
  }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const newRipple = { x, y, id: Date.now() };
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
      }
      
      onClick?.(event);
    };

    const getVariantClasses = () => {
      switch (variant) {
        case 'premium':
          return 'bg-gradient-to-r from-blue-600 to-teal-600 text-white border-0 hover:shadow-lg';
        case 'glow':
          return 'relative overflow-hidden bg-primary text-primary-foreground border-0 hover:shadow-xl';
        case 'shimmer':
          return 'relative overflow-hidden bg-primary text-primary-foreground border-0';
        case '3d':
          return 'transform-gpu bg-primary text-primary-foreground border-0 shadow-md hover:shadow-xl';
        case 'gradient':
          return getGradientClasses();
        default:
          return '';
      }
    };

    const getGradientClasses = () => {
      switch (gradientType) {
        case 'primary':
          return 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0';
        case 'secondary':
          return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0';
        case 'rainbow':
          return 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white border-0';
        case 'sunset':
          return 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0';
        case 'ocean':
          return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0';
        default:
          return 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0';
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'xl':
          return 'px-10 py-4 text-xl font-bold';
        case 'lg':
          return 'px-8 py-3 text-lg font-semibold';
        case 'sm':
          return 'px-3 py-1 text-sm';
        default:
          return '';
      }
    };

    const baseClasses = cn(
      'relative',
      'overflow-hidden',
      'transition-all duration-300',
      'transform-gpu',
      'font-medium',
      'select-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      getVariantClasses(),
      getSizeClasses(),
      {
        'btn-enhanced': hover3D || shimmerEffect || glowEffect,
        'hover-lift-3d': hover3D,
        'glow-on-hover': glowEffect,
        'shimmer-effect': shimmerEffect,
        'animate-pulse': pulseEffect,
        'cursor-not-allowed': loading || disabled,
        'loading-enhanced': loading
      },
      className
    );

    return (
      <Button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple Effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ripple"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Content */}
        <span className={`flex items-center justify-center gap-2 ${loading ? 'invisible' : 'visible'}`}>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </span>
        
        {/* Glow Effect Overlay */}
        {glowEffect && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
        
        {/* Shimmer Effect Overlay */}
        {shimmerEffect && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </div>
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

// Specialized button variants
export const PremiumButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="premium" {...props} />
);

export const GlowButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="glow" glowEffect {...props} />
);

export const ShimmerButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="shimmer" shimmerEffect {...props} />
);

export const Button3D = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="3d" hover3D {...props} />
);

export const GradientButton = ({ 
  gradientType = 'primary', 
  ...props 
}: Omit<EnhancedButtonProps, 'variant'> & { gradientType?: 'primary' | 'secondary' | 'rainbow' | 'sunset' | 'ocean' }) => (
  <EnhancedButton variant="gradient" gradientType={gradientType} {...props} />
);

// Animated button with continuous effects
export const AnimatedButton = ({ 
  pulseEffect = true,
  shimmerEffect = true,
  ...props 
}: EnhancedButtonProps) => (
  <EnhancedButton 
    pulseEffect={pulseEffect} 
    shimmerEffect={shimmerEffect} 
    hover3D 
    {...props} 
  />
);