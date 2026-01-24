'use client';
import { useState, useEffect } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/settings';

const STORAGE_KEY = 'nabd_user_settings_v1';

export function useSettings() {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
            }
        } catch (e) {
            console.error('Failed to load settings', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save changes
    const updateSettings = (newSettings: UserSettings) => {
        setSettings(newSettings);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));

            // Optional: Sync to backend if authenticated
            // await fetch('/api/settings', { method: 'PATCH', body: JSON.stringify(newSettings) });

        } catch (e) {
            console.error('Failed to save settings', e);
        }
    };

    return { settings, updateSettings, isLoaded };
}
