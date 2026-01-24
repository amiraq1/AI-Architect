export interface Attachment {
    name: string;
    type: string;
    content: string; // Base64 or URL
}

export type EventStatus = 'loading' | 'done' | 'error';
export type EventType = 'search' | 'read' | 'think' | 'write' | 'tool_call';

export interface ChatEvent {
    id: string;
    type: EventType;
    label: string;
    status: EventStatus;
    timestamp: number;
    meta?: any;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'error' | 'system';
    content: string;
    plan?: string[];
    events?: ChatEvent[];
    attachment?: {
        name: string;
        type: string;
    };
}
