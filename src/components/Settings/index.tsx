/**
 * 設定画面モーダルコンポーネント
 */

import { useState } from 'react';
import { useLanguage } from '../../contexts';
import GeneralSettings from './GeneralSettings.tsx';
import AlarmSettings from './AlarmSettings.tsx';
import StreamerSettings from './StreamerSettings.tsx';
import ApiSettings from './ApiSettings.tsx';
import './Settings.css';

interface SettingsProps {
    onClose: () => void;
}

type TabId = 'general' | 'alarm' | 'streamer' | 'api';

function Settings({ onClose }: SettingsProps) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabId>('general');

    const tabs: { id: TabId; labelKey: string }[] = [
        { id: 'general', labelKey: 'general_settings' },
        { id: 'alarm', labelKey: 'alarm_settings' },
        { id: 'streamer', labelKey: 'streamer_settings' },
        { id: 'api', labelKey: 'api_settings' },
    ];

    return (
        <div className="settings-overlay">
            <div className="settings-modal card animate-fade-in">
                <header className="settings-header">
                    <h2 className="settings-title">{t('settings_title')}</h2>
                    <button className="close-button" onClick={onClose} aria-label={t('close')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </header>

                <div className="settings-body">
                    <nav className="settings-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {t(tab.labelKey)}
                            </button>
                        ))}
                    </nav>

                    <div className="tab-content">
                        {activeTab === 'general' && <GeneralSettings />}
                        {activeTab === 'alarm' && <AlarmSettings />}
                        {activeTab === 'streamer' && <StreamerSettings />}
                        {activeTab === 'api' && <ApiSettings />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
