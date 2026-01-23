/**
 * Tauriコマンド呼び出しサービス
 */

import { invoke } from '@tauri-apps/api/core';
import { Config, defaultConfig } from '../types/config';

/**
 * 設定を取得
 */
export async function getConfig(): Promise<Config> {
    try {
        return await invoke<Config>('get_config');
    } catch (error) {
        console.error('Failed to get config:', error);
        return defaultConfig;
    }
}

/**
 * 設定を保存
 */
export async function saveConfig(config: Config): Promise<void> {
    try {
        await invoke('save_config', { config });
    } catch (error) {
        console.error('Failed to save config:', error);
        throw error;
    }
}

/**
 * 設定をリロード
 */
export async function reloadConfig(): Promise<Config> {
    try {
        return await invoke<Config>('reload_config');
    } catch (error) {
        console.error('Failed to reload config:', error);
        return defaultConfig;
    }
}
