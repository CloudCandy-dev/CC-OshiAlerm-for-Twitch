import { useEffect, useRef } from 'react';
import { listen } from '@tauri-apps/api/event';
import { audioService } from '../services/audioService';
import { useConfig } from '../contexts/ConfigContext';

interface AlarmPayload {
    channel: string;
    sound_path: string;
}

export function useAlarm() {
    const { config } = useConfig();
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // アラーム開始受信
        const unlistenStart = listen<AlarmPayload>('alarm-started', (event) => {
            const { sound_path } = event.payload;
            console.log('Alarm event received. Starting playback:', sound_path);

            // フロントエンドでの音声再生を開始
            audioService.play(sound_path).catch(err => {
                console.error('Failed to play alarm sound in hook:', err);
            });

            // 自動停止タイマーを設定
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                console.log('Alarm timeout reached. Stopping automatically.');
                audioService.stop();
            }, config.alarm_duration_minutes * 60 * 1000);
        });

        // アラーム停止受信
        const unlistenStop = listen('alarm-stopped', () => {
            console.log('Alarm stop event received. Stopping playback.');
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            audioService.stop();
        });

        return () => {
            unlistenStart.then(unlisten => unlisten());
            unlistenStop.then(unlisten => unlisten());
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [config.alarm_duration_minutes]);

    return {
        stopAlarm: () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            audioService.stop();
        },
    };
}
