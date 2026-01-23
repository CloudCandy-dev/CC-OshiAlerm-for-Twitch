/**
 * 一般設定タブ
 */

import { useConfig, useLanguage, useTheme } from '../../contexts';

function GeneralSettings() {
    const { config, updateConfig } = useConfig();
    const { t, availableLanguages, setLanguage } = useLanguage();
    const { availableThemes, setTheme } = useTheme();

    return (
        <div className="general-settings">
            <div className="settings-group">
                <div className="settings-row">
                    <label className="settings-label">{t('language')}</label>
                    <select
                        value={config.language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {availableLanguages.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.displayName}</option>
                        ))}
                    </select>
                </div>

                <div className="settings-row">
                    <label className="settings-label">{t('theme')}</label>
                    <select
                        value={config.theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        {availableThemes.map(theme => (
                            <option key={theme.id} value={theme.id}>{theme.displayName}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="settings-group">
                <div className="settings-row">
                    <label className="settings-label">{t('auto_start')}</label>
                    <input
                        type="checkbox"
                        checked={config.auto_start}
                        onChange={(e) => updateConfig({ auto_start: e.target.checked })}
                    />
                </div>

                <div className="settings-row">
                    <label className="settings-label">{t('minimize_to_tray')}</label>
                    <input
                        type="checkbox"
                        checked={config.minimize_to_tray}
                        onChange={(e) => updateConfig({ minimize_to_tray: e.target.checked })}
                    />
                </div>
            </div>
        </div>
    );
}

export default GeneralSettings;
