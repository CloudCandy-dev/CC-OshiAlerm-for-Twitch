/**
 * Twitch API設定タブ
 */

import { useState } from 'react';
import { useConfig, useLanguage } from '../../contexts';

function ApiSettings() {
    const { config, updateConfig } = useConfig();
    const { t } = useLanguage();
    const [showId, setShowId] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    const inputStyle: React.CSSProperties = {
        width: '100%',
        paddingRight: '40px', // マEジンを作ってアイコンと重ならないようにすE
    };

    const toggleButtonStyle: React.CSSProperties = {
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-secondary)',
    };

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    return (
        <div className="api-settings">
            <div className="settings-group">
                <label className="settings-group-title">{t('api_settings')}</label>
                <p className="settings-hint" style={{ marginBottom: '16px' }}>{t('api_hint')}</p>

                <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <label className="settings-label">{t('client_id')}</label>
                    <div style={containerStyle}>
                        <input
                            type={showId ? 'text' : 'password'}
                            value={config.client_id}
                            onChange={(e) => updateConfig({ client_id: e.target.value })}
                            style={inputStyle}
                        />
                        <button
                            type="button"
                            style={toggleButtonStyle}
                            onClick={() => setShowId(!showId)}
                            title={showId ? t('hide') : t('show')}
                        >
                            {showId ? '👁️' : '🫣'}
                        </button>
                    </div>
                </div>

                <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', marginTop: '12px' }}>
                    <label className="settings-label">{t('client_secret')}</label>
                    <div style={containerStyle}>
                        <input
                            type={showSecret ? 'text' : 'password'}
                            value={config.client_secret}
                            onChange={(e) => updateConfig({ client_secret: e.target.value })}
                            style={inputStyle}
                        />
                        <button
                            type="button"
                            style={toggleButtonStyle}
                            onClick={() => setShowSecret(!showSecret)}
                            title={showSecret ? t('hide') : t('show')}
                        >
                            {showSecret ? '👁️' : '🫣'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiSettings;
