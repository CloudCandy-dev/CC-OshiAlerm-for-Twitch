import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StreamerItem from '../components/MainWindow/StreamerItem'
import { listen } from '@tauri-apps/api/event'

// Mock useLanguage
vi.mock('../contexts', () => ({
    useLanguage: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                streaming: '配信中',
                offline: 'オフライン'
            }
            return translations[key] || key
        }
    })
}))

// Mock tauri event listen
vi.mock('@tauri-apps/api/event', () => ({
    listen: vi.fn(() => Promise.resolve(() => { }))
}))

describe('StreamerItem', () => {
    const mockChannel = {
        name: 'test_streamer',
        priority: 1,
        actions: []
    }

    it('renders streamer name', () => {
        // @ts-ignore
        render(<StreamerItem channel={mockChannel} />)
        expect(screen.getByText('test_streamer')).toBeInTheDocument()
        expect(screen.getByText('オフライン')).toBeInTheDocument()
    })

    it('updates status when receiving event', async () => {
        let eventCallback: any;
        (listen as any).mockImplementation((name: string, cb: any) => {
            if (name === 'stream-status-updated') {
                eventCallback = cb;
            }
            return Promise.resolve(() => { });
        });

        // @ts-ignore
        render(<StreamerItem channel={mockChannel} />)

        // Simulate event
        if (eventCallback) {
            await act(async () => {
                eventCallback({
                    payload: [
                        {
                            name: 'test_streamer',
                            is_live: true,
                            title: 'Live Title'
                        }
                    ]
                });
            });
        }

        expect(screen.getByText('Live Title')).toBeInTheDocument()
        expect(screen.getByText('配信中')).toBeInTheDocument()
    })
})
