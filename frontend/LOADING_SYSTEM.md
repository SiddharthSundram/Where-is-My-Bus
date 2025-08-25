# 3D Bus Loading System Documentation

## Overview

The 3D Bus Loading System is a comprehensive loading solution for the "Where is My Bus" application that provides engaging, brand-consistent loading animations throughout the entire site. The system features 3D rotating buses, smooth animations, and various loading states.

## Features

### 🎨 3D Bus Animations
- **3D Rotating Bus**: Full 3D bus with multiple faces and realistic rotation
- **Orbiting Elements**: Colored dots orbiting around the main bus
- **Pulsing Rings**: Expanding rings for additional visual interest
- **Multiple Sizes**: Small, medium, large, and extra-large variants

### 🚀 Loading Components
- **Loading3DBus**: Main loading component with progress bar support
- **MiniLoadingBus**: Compact inline loading indicator
- **LoadingButton**: Buttons with integrated loading states
- **AsyncLoadingButton**: Async operation buttons with error handling
- **LoadingCard**: Card-shaped loading skeletons
- **LoadingGrid**: Grid layout for multiple loading cards
- **LoadingList**: List-style loading skeletons
- **LoadingTable**: Table loading skeletons

### 🎯 Loading Management
- **LoadingProvider**: Global context for loading state management
- **useLoading**: Hook for accessing loading functions
- **usePageLoader**: Hook for page-level loading operations
- **useInlineLoader**: Hook for inline loading operations
- **Page Transitions**: Smooth transitions between pages

### 📋 Skeleton Components
- **Skeleton**: Basic text skeleton
- **AvatarSkeleton**: Circular avatar placeholder
- **TextSkeleton**: Multi-line text placeholder
- **ButtonSkeleton**: Button placeholder
- **CardSkeleton**: Card content placeholder
- **ListSkeleton**: List item placeholder
- **TableSkeleton**: Table data placeholder
- **ChartSkeleton**: Chart visualization placeholder
- **StatsSkeleton**: Statistics cards placeholder

## Installation

The loading system is automatically integrated into the application through the root layout. No additional installation is required.

## Usage

### Basic Loading Component

```tsx
import { Loading3DBus } from "@/components/loading-3d-bus";

// Basic usage
<Loading3DBus />

// With custom size and text
<Loading3DBus size="lg" text="Loading your journey..." />

// With progress bar
<Loading3DBus showProgress={true} fullScreen={true} />
```

### Loading Provider

The loading provider is automatically wrapped around the entire application in `layout.tsx`:

```tsx
import { LoadingProvider } from "@/components/loading-provider";

function App() {
  return (
    <LoadingProvider>
      {/* Your app content */}
    </LoadingProvider>
  );
}
```

### Using Loading Hooks

```tsx
import { useLoading, usePageLoader, useInlineLoader } from "@/components/loading-provider";

function MyComponent() {
  const { showPageLoader, hidePageLoader } = useLoading();
  const { withLoading } = usePageLoader();
  const { withInlineLoading } = useInlineLoader();

  // Manual control
  const handleManualLoad = () => {
    showPageLoader("Loading data...");
    // ... do work
    hidePageLoader();
  };

  // With helper hook
  const handleAsyncLoad = async () => {
    await withLoading(
      async () => {
        // Your async operation
        await fetchData();
      },
      "Loading with helper..."
    );
  };

  return (
    <div>
      <button onClick={handleManualLoad}>Manual Load</button>
      <button onClick={handleAsyncLoad}>Async Load</button>
    </div>
  );
}
```

### Loading Buttons

```tsx
import { LoadingButton, AsyncLoadingButton } from "@/components/loading-button";

// Basic loading button
function MyForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await submitForm();
    setIsLoading(false);
  };

  return (
    <LoadingButton
      loading={isLoading}
      onClick={handleSubmit}
      loadingText="Submitting..."
    >
      Submit Form
    </LoadingButton>
  );
}

// Async loading button
function AsyncComponent() {
  const handleSubmit = async () => {
    await submitForm();
  };

  return (
    <AsyncLoadingButton
      onClick={handleSubmit}
      loadingText="Submitting..."
      onError={(error) => console.error("Error:", error)}
      onSuccess={() => console.log("Success!")}
    >
      Submit Async
    </AsyncLoadingButton>
  );
}
```

### Loading Skeletons

```tsx
import {
  Skeleton,
  AvatarSkeleton,
  TextSkeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton
} from "@/components/loading-skeleton";

// Text skeleton
<Skeleton lines={3} />

// Profile card skeleton
<CardSkeleton header={true} lines={4} showAvatar={true} />

// List skeleton
<ListSkeleton count={5} avatar={true} />

// Table skeleton
<TableSkeleton rows={10} columns={5} />
```

### Page Transitions

Page transitions are automatically handled by the `WithPageTransition` component in the root layout:

```tsx
import { WithPageTransition } from "@/components/with-page-transition";

function MyPage() {
  return (
    <WithPageTransition minLoadingTime={1000}>
      {/* Page content */}
    </WithPageTransition>
  );
}
```

## Component Props

### Loading3DBus

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "sm" \| "md" \| "lg" \| "xl" | "md" | Size of the loading component |
| text | string | "Loading Where is My Bus..." | Loading text to display |
| showProgress | boolean | false | Whether to show progress bar |
| fullScreen | boolean | false | Whether to use full-screen overlay |
| className | string | "" | Additional CSS classes |

### LoadingButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| loading | boolean | false | Loading state |
| loadingText | string | undefined | Text to show while loading |
| showLoader | boolean | true | Whether to show loader |
| ...ButtonProps | - | - | All standard Button props |

### AsyncLoadingButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onClick | () => Promise<void> | - | Async function to execute |
| loadingText | string | undefined | Text to show while loading |
| showLoader | boolean | true | Whether to show loader |
| onError | (error: any) => void | undefined | Error callback |
| onSuccess | (result: any) => void | undefined | Success callback |
| ...ButtonProps | - | - | All standard Button props |

## Customization

### CSS Customization

All animations are defined in `globals.css` and can be customized:

```css
/* Customize 3D bus rotation speed */
.animate-3d-bus-rotate {
  animation: 3d-bus-rotate 4s linear infinite;
}

/* Customize colors */
.bus-face {
  background: linear-gradient(to right, #your-color, #your-color-2);
}
```

### Animation Timing

Animation durations can be adjusted in the keyframe definitions:

```css
@keyframes 3d-bus-rotate {
  /* Adjust timing for faster/slower rotation */
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(0deg) rotateY(360deg); }
}
```

## Performance Considerations

- **GPU Acceleration**: All 3D transforms use `transform-gpu` for hardware acceleration
- **CSS Animations**: Pure CSS animations for optimal performance
- **Minimal JavaScript**: Lightweight JavaScript for state management
- **Tree Shaking**: Unused components are tree-shaken in production builds

## Browser Support

The loading system supports all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Demo

A comprehensive demo of all loading components is available at `/loading-demo` in the development environment.

## Best Practices

1. **Use Appropriate Loading States**: Choose the right loading component for the context
2. **Provide Meaningful Feedback**: Use descriptive loading text when possible
3. **Handle Errors Gracefully**: Always include error handling for async operations
4. **Keep Loading Times Reasonable**: Don't show loaders for very quick operations
5. **Maintain Consistency**: Use the same loading style throughout the application

## Troubleshooting

### Common Issues

**3D transforms not working:**
- Ensure `transform-style: preserve-3d` is applied
- Check browser compatibility for 3D transforms
- Verify CSS classes are correctly applied

**Loading state not updating:**
- Check that hooks are used within the LoadingProvider context
- Verify async functions are properly awaited
- Ensure state updates are triggering re-renders

**Performance issues:**
- Reduce the number of simultaneous animations
- Use simpler animations for mobile devices
- Check for excessive re-renders

## Contributing

When adding new loading components:
1. Follow the existing naming conventions
2. Include TypeScript props interfaces
3. Add comprehensive JSDoc comments
4. Create examples in the demo page
5. Update this documentation

## License

This loading system is part of the "Where is My Bus" application and follows the same license terms.