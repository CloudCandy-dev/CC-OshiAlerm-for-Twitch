/**
 * 設定Context - アプリ全体で設定を共有
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Config, defaultConfig } from '../types/config';
import { getConfig, saveConfig as saveConfigApi } from '../services/tauriCommands';

interface ConfigContextType {
    config: Config;
    loading: boolean;
    error: string | null;
    saveConfig: (config: Config) => Promise<void>;
    reloadConfig: () => Promise<void>;
    updateConfig: (updates: Partial<Config>) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
    children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
    const [config, setConfig] = useState<Config>(defaultConfig);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 初回ロード
    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        setError(null);
        try {
            const loadedConfig = await getConfig();
            setConfig(loadedConfig);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load config');
            console.error('Failed to load config:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = useCallback(async (newConfig: Config) => {
        setError(null);
        try {
            await saveConfigApi(newConfig);
            setConfig(newConfig);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save config');
            throw err;
        }
    }, []);

    const reloadConfig = useCallback(async () => {
        await loadConfig();
    }, []);

    const updateConfig = useCallback(async (updates: Partial<Config>) => {
        const newConfig = { ...config, ...updates };
        await saveConfig(newConfig);
    }, [config, saveConfig]);

    const value: ConfigContextType = {
        config,
        loading,
        error,
        saveConfig,
        reloadConfig,
        updateConfig,
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
}
