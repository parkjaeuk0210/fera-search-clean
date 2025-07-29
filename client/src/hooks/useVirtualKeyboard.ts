import { useEffect, useState, useCallback } from 'react';

interface VirtualKeyboardState {
  isVisible: boolean;
  height: number;
}

export function useVirtualKeyboard() {
  const [keyboardState, setKeyboardState] = useState<VirtualKeyboardState>({
    isVisible: false,
    height: 0,
  });

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportChange = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;

      // Calculate keyboard height
      const hasKeyboard = window.innerHeight - viewport.height > 50;
      const keyboardHeight = hasKeyboard ? window.innerHeight - viewport.height : 0;

      setKeyboardState({
        isVisible: hasKeyboard,
        height: keyboardHeight,
      });
    };

    // Initial check
    handleViewportChange();

    // Listen for viewport changes
    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, []);

  const hideKeyboard = useCallback(() => {
    // Blur any focused input to hide keyboard
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && 'blur' in activeElement) {
      activeElement.blur();
    }
  }, []);

  return {
    isKeyboardVisible: keyboardState.isVisible,
    keyboardHeight: keyboardState.height,
    hideKeyboard,
  };
}