export interface UserSettings {
    general: {
        theme: 'system' | 'dark' | 'light';
        language: 'ar' | 'en';
        notifications: boolean;
    };
    chat: {
        defaultModel: 'llama-3.1-8b-instant' | 'llama-3.3-70b-versatile';
        fontSize: 'small' | 'medium' | 'large';
        sendOnEnter: boolean;
        streamSpeed: 'normal' | 'fast';
    };
    privacy: {
        dataRetentionDays: number;
        allowTraining: boolean;
    };
}

export const DEFAULT_SETTINGS: UserSettings = {
    general: {
        theme: 'dark',
        language: 'ar',
        notifications: true
    },
    chat: {
        defaultModel: 'llama-3.1-8b-instant',
        fontSize: 'medium',
        sendOnEnter: true,
        streamSpeed: 'normal'
    },
    privacy: {
        dataRetentionDays: 30,
        allowTraining: false
    }
};
