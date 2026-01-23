import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { LanguageData, AvailableLanguage } from '../types/language';
import { useConfig } from './ConfigContext';
import { invoke } from '@tauri-apps/api/core';

interface LanguageContextType {
    currentLanguage: string;
    availableLanguages: AvailableLanguage[];
    t: (key: string, params?: Record<string, string>) => string;
    setLanguage: (code: string) => Promise<void>;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const { config, updateConfig } = useConfig();
    const [languageData, setLanguageData] = useState<LanguageData>({});
    const [availableLanguages, setAvailableLanguages] = useState<AvailableLanguage[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState(config.language || 'ja');
    const [isLoading, setIsLoading] = useState(true);

    // 利用可能な言語一覧を取得
    useEffect(() => {
        invoke<AvailableLanguage[]>('get_available_languages')
            .then(setAvailableLanguages)
            .catch(err => console.error('Failed to get available languages:', err));
    }, []);

    // 言語ファイルを読み込み
    useEffect(() => {
        const langCode = config.language || 'ja';
        loadLanguageFile(langCode);
    }, [config.language]);

    const loadLanguageFile = async (langCode: string) => {
        setIsLoading(true);
        try {
            const langData = await invoke<LanguageData>('get_language_data', { code: langCode });
            setLanguageData(langData);
            setCurrentLanguage(langCode);
        } catch (error) {
            console.error(`Failed to load language file for ${langCode}:`, error);
            // エラー時は空データ。t関数がキーをそのまま返す。
            setLanguageData({});
        } finally {
            setIsLoading(false);
        }
    };

    // テキスト取得関数
    const t = useCallback((key: string, params?: Record<string, string>): string => {
        let text = languageData[key] || key;

        // パラメータ置換 {param} → 値
        if (params) {
            Object.entries(params).forEach(([paramKey, value]) => {
                text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), value);
            });
        }

        return text;
    }, [languageData]);

    // 言語変更
    const setLanguage = useCallback(async (code: string) => {
        await updateConfig({ language: code });
    }, [updateConfig]);

    const value: LanguageContextType = {
        currentLanguage,
        availableLanguages,
        t,
        setLanguage,
        isLoading,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
