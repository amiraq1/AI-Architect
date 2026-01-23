export interface Attachment {
    name: string;
    type: string;
    content: string; // Base64
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'error';
    content: string;
    plan?: string[];
    attachment?: {
        name: string;
        type: string;
    };
}
