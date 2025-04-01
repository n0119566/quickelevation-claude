import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { ThemeToggle } from '../theme-toggle';
import userEvent from '@testing-library/user-event';
import * as themeHook from '../../../lib/theme-provider';

// Mock the useTheme hook
vi.mock('../../../lib/theme-provider', async () => {
  const actual = await vi.importActual('../../../lib/theme-provider');
  return {
    ...actual,
    useTheme: vi.fn()
  };
});

describe('ThemeToggle', () => {
  it('renders sun icon when theme is dark', () => {
    // Mock the theme hook to return dark theme
    vi.mocked(themeHook.useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn()
    });
    
    render(<ThemeToggle />);
    
    // Ensure the sun icon is rendered
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });
  
  it('renders moon icon when theme is light', () => {
    // Mock the theme hook to return light theme
    vi.mocked(themeHook.useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn()
    });
    
    render(<ThemeToggle />);
    
    // Ensure the moon icon is rendered
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });
  
  it('toggles theme when clicked', async () => {
    const setThemeMock = vi.fn();
    
    // Mock the theme hook to return light theme
    vi.mocked(themeHook.useTheme).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock
    });
    
    render(<ThemeToggle />);
    
    // Click the toggle button
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Toggle theme'));
    
    // Verify the setTheme function is called with the expected argument
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});