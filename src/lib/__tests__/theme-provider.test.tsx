import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '../theme-provider';
import userEvent from '@testing-library/user-event';

// Mock component that uses the theme hook
function TestComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();
  
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    localStorageMock.clear();
  });
  
  it('provides default theme', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });
  
  it('allows changing the theme', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    
    const user = userEvent.setup();
    await user.click(screen.getByText('Set Dark'));
    
    // Wait for state update to complete
    await waitFor(() => {
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('quickelevation-theme', 'dark');
  });
  
  it('reads theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark');
    
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
  });
});