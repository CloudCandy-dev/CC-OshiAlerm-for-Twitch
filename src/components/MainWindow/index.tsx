import { useState } from 'react';
import { useConfig } from '../../contexts';
import { useLanguage } from '../../contexts';
import StreamerList from './StreamerList';
import AlarmControls from './AlarmControls';
import Settings from '../Settings/index.tsx';
import './MainWindow.css';

function MainWindow() {
    const { config, loading } = useConfig();
    const { t } = useLanguage();
    const [showSettings, setShowSettings] = useState(false);

    if (loading) {
        return (
            <div className="main-window loading">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="main-window">
            <header className="main-header">
                <h1 className="app-title">{t('app_title')}</h1>
                <button
                    className="settings-button"
                    onClick={() => setShowSettings(true)}
                    title={t('settings')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </header>

            {showSettings && <Settings onClose={() => setShowSettings(false)} />}

            <main className="main-content">
                <section className="streamers-section card">
                    <h2 className="section-title">{t('monitoring_streamers')}</h2>
                    <StreamerList channels={config.channels} />
                </section>
            </main>

            <footer className="main-footer">
                <AlarmControls />
            </footer>
        </div>
    );
}

export default MainWindow;
