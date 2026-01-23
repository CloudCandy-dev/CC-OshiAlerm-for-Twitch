/**
 * アラーム操作コンポーネント
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import './AlarmControls.css';

function AlarmControls() {
    const { t } = useLanguage();
    const [isAlarmActive, setIsAlarmActive] = useState(false);

    // アラーム開始/終了イベントのリスニング
    useEffect(() => {
        const unlistenStart = listen('alarm-started', () => {
            setIsAlarmActive(true);
        });

        const unlistenStop = listen('alarm-stopped', () => {
            setIsAlarmActive(false);
        });

        return () => {
            unlistenStart.then(unlisten => unlisten());
            unlistenStop.then(unlisten => unlisten());
        };
    }, []);

    const handleStopAlarm = async () => {
        try {
            await invoke('stop_alarm');
            setIsAlarmActive(false);
        } catch (error) {
            console.error('Failed to stop alarm:', error);
        }
    };

    if (!isAlarmActive) {
        return null; // アラームが鳴っていない時は表示しない
    }

    return (
        <div className="alarm-controls">
            <div className="alarm-status">
                <div className="alarm-icon animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <span className="alarm-message">{t('alarm_started')}</span>
            </div>
            <button className="stop-alarm-button" onClick={handleStopAlarm}>
                {t('stop_alarm')}
            </button>
        </div>
    );
}

export default AlarmControls;
