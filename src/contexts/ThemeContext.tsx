import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Theme, AvailableTheme } from '../types/theme';
import { useConfig } from './ConfigContext';
import { invoke } from '@tauri-apps/api/core';

interface ThemeContextType {
    theme: Theme | null;
    currentThemeId: string;
    availableThemes: AvailableTheme[];
    setTheme: (id: string) => Promise<void>;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { config, updateConfig } = useConfig();
    const [theme, setThemeState] = useState<Theme | null>(null);
    const [availableThemes, setAvailableThemes] = useState<AvailableTheme[]>([]);
    const [currentThemeId, setCurrentThemeId] = useState(config.theme || 'light');
    const [isLoading, setIsLoading] = useState(true);

    // 利用可能なテーマ一覧を取得
    useEffect(() => {
        invoke<AvailableTheme[]>('get_available_themes')
            .then(setAvailableThemes)
            .catch(err => console.error('Failed to get available themes:', err));
    }, []);

    // テーマを設定ファイルから読み込み
    useEffect(() => {
        const themeId = config.theme || 'light';
        loadTheme(themeId);
    }, [config.theme]);

    const loadTheme = async (themeId: string) => {
        setIsLoading(true);
        try {
            const themeData = await invoke<Theme>('get_theme_data', { id: themeId });
            setThemeState(themeData);
            setCurrentThemeId(themeId);
        } catch (error) {
            console.error(`Failed to load theme file for ${themeId}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    // CSS変数を適用
    useEffect(() => {
        if (!theme || !theme.colors) return;

        const root = document.documentElement;
        const { colors } = theme;

        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-primary-light', colors.primaryLight);
        root.style.setProperty('--color-primary-dark', colors.primaryDark);
        root.style.setProperty('--color-background', colors.background);
        root.style.setProperty('--color-surface', colors.surface);
        root.style.setProperty('--color-surface-hover', colors.surfaceHover);
        root.style.setProperty('--color-border', colors.border);
        root.style.setProperty('--color-border-light', colors.borderLight);
        root.style.setProperty('--color-text', colors.text);
        root.style.setProperty('--color-text-secondary', colors.textSecondary);
        root.style.setProperty('--color-text-on-primary', colors.textOnPrimary);
        root.style.setProperty('--color-success', colors.success);
        root.style.setProperty('--color-error', colors.error);
        root.style.setProperty('--color-warning', colors.warning);
        root.style.setProperty('--box-shadow', `0 2px 8px ${colors.shadow}`);
    }, [theme]);

    // テーマ変更
    const setTheme = useCallback(async (id: string) => {
        await updateConfig({ theme: id });
    }, [updateConfig]);

    const value: ThemeContextType = {
        theme,
        currentThemeId,
        availableThemes,
        setTheme,
        isLoading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
