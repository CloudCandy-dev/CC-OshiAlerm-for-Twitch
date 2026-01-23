/**
 * 個別配信者表示コンポーネント
 */

import { useState, useEffect } from 'react';
import { Channel } from '../../types/config';
import { useLanguage } from '../../contexts';
import { listen } from '@tauri-apps/api/event';
import './StreamerItem.css';

interface StreamerItemProps {
    channel: Channel;
}

interface StreamStatus {
    is_live: boolean;
    title?: string;
    viewer_count?: number;
}

function StreamerItem({ channel }: StreamerItemProps) {
    const { t } = useLanguage();
    const [status, setStatus] = useState<StreamStatus>({ is_live: false });

    // 配信状態更新イベントのリスニング
    useEffect(() => {
        const unlistenPromise = listen<StreamStatus[]>('stream-status-updated', (event) => {
            const myStatus = event.payload.find(s => (s as any).name === channel.name);
            if (myStatus) {
                setStatus(myStatus);
            }
        });

        return () => {
            unlistenPromise.then(unlisten => unlisten());
        };
    }, [channel.name]);

    return (
        <div className={`streamer-item ${status.is_live ? 'live' : 'offline'}`}>
            <div className="streamer-info">
                <div className="streamer-name-container">
                    <span className="status-indicator"></span>
                    <h3 className="streamer-name">{channel.name}</h3>
                </div>
                {status.is_live && status.title && (
                    <p className="stream-title" title={status.title}>{status.title}</p>
                )}
            </div>
            <div className="streamer-status-badge">
                {status.is_live ? (
                    <span className="badge live">{t('streaming')}</span>
                ) : (
                    <span className="badge offline">{t('offline')}</span>
                )}
            </div>
        </div>
    );
}

export default StreamerItem;
