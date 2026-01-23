/**
 * 配信者一覧コンポーネント
 */

import { Channel } from '../../types/config';
import StreamerItem from './StreamerItem';
import { useLanguage } from '../../contexts';

interface StreamerListProps {
    channels: Channel[];
}

function StreamerList({ channels }: StreamerListProps) {
    const { t } = useLanguage();

    if (channels.length === 0) {
        return (
            <div className="streamer-list empty">
                <p className="empty-message">{t('no_streamers')}</p>
            </div>
        );
    }

    return (
        <div className="streamer-list">
            {channels.map((channel) => (
                <StreamerItem key={channel.name} channel={channel} />
            ))}
        </div>
    );
}

export default StreamerList;
