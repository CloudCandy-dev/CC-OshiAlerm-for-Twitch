/**
 * オーディオ再生サービス
 * Web Audio APIを使用してMP3を再生・停止
 */

import { convertFileSrc } from '@tauri-apps/api/core';

class AudioService {
    private audio: HTMLAudioElement | null = null;

    /**
     * 音声を再生（ループ）
     * @param filePath アラーム音のフルパス
     */
    async play(filePath: string): Promise<void> {
        this.stop();

        // TauriのURLに変換
        const assetUrl = convertFileSrc(filePath);

        this.audio = new Audio(assetUrl);
        this.audio.loop = true;

        try {
            await this.audio.play();
            console.log('Audio playback started:', filePath);
        } catch (error) {
            console.error('Failed to play audio:', error);
            throw error;
        }
    }

    /**
     * 再生停止
     */
    stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
            console.log('Audio playback stopped');
        }
    }
}

export const audioService = new AudioService();
export default audioService;
