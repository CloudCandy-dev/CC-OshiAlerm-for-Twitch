import { useConfig, useLanguage } from '../../contexts';
import { invoke } from '@tauri-apps/api/core';

function AlarmSettings() {
    const { config, updateConfig } = useConfig();
    const { t } = useLanguage();

    const handleSelectFile = async () => {
        try {
            const selectedPath = await invoke<string | null>('open_file_dialog');
            if (selectedPath) {
                // ファイルをアプリ内ディレクトリにインポEト
                const importedPath = await invoke<string>('import_alarm_sound', { path: selectedPath });
                updateConfig({ alarm_sound_path: importedPath });
            }
        } catch (err) {
            console.error('Failed to import alarm sound:', err);
        }
    };

    return (
        <div className="alarm-settings">
            <div className="settings-group">
                <div className="settings-row">
                    <label className="settings-label">{t('alarm_sound')}</label>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <input
                            type="text"
                            value={config.alarm_sound_path}
                            readOnly
                            style={{ flex: 1, minWidth: 0 }}
                        />
                        <button className="settings-button-outline" onClick={handleSelectFile}>
                            {t('select_file')}
                        </button>
                    </div>
                </div>

                <div className="settings-row">
                    <label className="settings-label">{t('alarm_duration')}</label>
                    <input
                        type="number"
                        min="1"
                        max="60"
                        value={config.alarm_duration_minutes}
                        onChange={(e) => updateConfig({ alarm_duration_minutes: parseInt(e.target.value) })}
                        style={{ width: '80px' }}
                    />
                </div>
            </div>

            <div className="settings-group">
                <label className="settings-group-title">{t('monitoring_settings')}</label>
                <div className="settings-row">
                    <label className="settings-label">{t('check_interval')}</label>
                    <div>
                        <input
                            type="number"
                            min="30"
                            value={config.check_interval_seconds}
                            onChange={(e) => updateConfig({ check_interval_seconds: parseInt(e.target.value) })}
                            style={{ width: '80px' }}
                        />
                        <p className="settings-hint">{t('check_interval_hint')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlarmSettings;
