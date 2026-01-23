/**
 * 配信者設定タブ
 */

import { useState } from 'react';
import { useConfig, useLanguage } from '../../contexts';
import { Channel } from '../../types/config';
import { checkStreamsNow } from '../../services/tauriCommands';

function StreamerSettings() {
    const { config, updateConfig } = useConfig();
    const { t } = useLanguage();
    const [newStreamer, setNewStreamer] = useState('');

    const handleAddStreamer = () => {
        if (!newStreamer.trim()) return;

        // 重複チェック
        if (config.channels.some(c => c.name.toLowerCase() === newStreamer.trim().toLowerCase())) {
            setNewStreamer('');
            return;
        }

        const newChannel: Channel = {
            name: newStreamer.trim(),
            priority: 1,
            actions: [{ type: 'alarm' }]
        };

        updateConfig({
            channels: [...config.channels, newChannel]
        }).then(() => {
            // 追加後に即座にチェックを実行
            checkStreamsNow();
        });
        setNewStreamer('');
    };

    const handleRemoveStreamer = (name: string) => {
        updateConfig({
            channels: config.channels.filter(c => c.name !== name)
        });
    };

    const handlePriorityChange = (name: string, priority: number) => {
        updateConfig({
            channels: config.channels.map(c =>
                c.name === name ? { ...c, priority } : c
            )
        });
    };

    return (
        <div className="streamer-settings">
            <div className="add-streamer-form" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder={t('streamer_name')}
                    value={newStreamer}
                    onChange={(e) => setNewStreamer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStreamer()}
                    style={{ flex: 1 }}
                />
                <button className="settings-button-primary" onClick={handleAddStreamer} style={{ whiteSpace: 'nowrap' }}>
                    {t('add_streamer')}
                </button>
            </div>

            <div className="streamer-list-settings">
                {config.channels.map(channel => (
                    <div key={channel.name} className="streamer-config-item" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        borderBottom: '1px solid var(--color-border-light)'
                    }}>
                        <span style={{ fontWeight: 600 }}>{channel.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span className="settings-label" style={{ fontSize: '12px' }}>{t('priority')}</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={channel.priority}
                                    onChange={(e) => handlePriorityChange(channel.name, parseInt(e.target.value))}
                                    style={{ width: '40px', padding: '2px 4px' }}
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveStreamer(channel.name)}
                                style={{ color: 'var(--color-error)', fontSize: '12px' }}
                            >
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StreamerSettings;
