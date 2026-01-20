/**
 * Nabd AI Agent - OpenSaaS Server Actions
 * Copy this file to: src/server/actions.ts
 */

import axios, { AxiosError } from 'axios';
import type { User } from 'wasp/entities';
import { HttpError } from 'wasp/server';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface GenerateNabdResponseInput {
  prompt: string;
  agentMode?: 'general' | 'coder' | 'writer' | 'researcher';
  modelName?: 'llama-3.1-8b-instant' | 'llama-3.3-70b-versatile';
  imagePath?: string;
}

export interface NabdResponse {
  success: boolean;
  result: string;
  plan: string[];
  steps_executed: number;
}

export interface SpeakInput {
  text: string;
  voice?: string;
}

export interface SpeakResponse {
  audio_url: string;
}

type Context = {
  user: User | null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const NABD_API_URL = process.env.NABD_API_URL;
const NABD_SECRET_KEY = process.env.NABD_SECRET_KEY;

const nabdHeaders = {
  'Content-Type': 'application/json',
  'X-NABD-SECRET': NABD_SECRET_KEY || '',
};

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function validateConfig(): void {
  if (!NABD_API_URL) {
    throw new HttpError(500, 'NABD_API_URL is not configured');
  }
  if (!NABD_SECRET_KEY) {
    throw new HttpError(500, 'NABD_SECRET_KEY is not configured');
  }
}

function validateAuth(context: Context): User {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to use this feature');
  }
  return context.user;
}

function validateSubscription(user: User): void {
  // Check if user has active subscription
  // Adjust this based on your OpenSaaS subscription model
  const status = (user as any).subscriptionStatus;
  if (status !== 'active' && status !== 'past_due') {
    throw new HttpError(403, 'Active subscription required. Please upgrade your plan.');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate AI response using Nabd Agent
 * 
 * Usage in Wasp:
 * ```wasp
 * action generateNabdResponse {
 *   fn: import { generateNabdResponse } from "@src/server/actions",
 *   entities: [User]
 * }
 * ```
 */
export async function generateNabdResponse(
  args: GenerateNabdResponseInput,
  context: Context
): Promise<NabdResponse> {
  // Validate configuration
  validateConfig();
  
  // Auth check
  const user = validateAuth(context);
  
  // Subscription check
  validateSubscription(user);
  
  try {
    const response = await axios.post<NabdResponse>(
      `${NABD_API_URL}/run`,
      {
        prompt: args.prompt,
        thread_id: `opensaas_${user.id}`,
        agent_mode: args.agentMode || 'general',
        model_name: args.modelName || 'llama-3.1-8b-instant',
        image_path: args.imagePath,
      },
      { headers: nabdHeaders, timeout: 120000 }
    );
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.detail || 'Failed to connect to Nabd AI';
      throw new HttpError(status, message);
    }
    throw new HttpError(500, 'Unexpected error occurred');
  }
}

/**
 * Text-to-Speech using Nabd
 */
export async function generateNabdSpeech(
  args: SpeakInput,
  context: Context
): Promise<SpeakResponse> {
  validateConfig();
  const user = validateAuth(context);
  validateSubscription(user);
  
  try {
    const response = await axios.post<SpeakResponse>(
      `${NABD_API_URL}/speak`,
      {
        text: args.text,
        voice: args.voice || 'ar-SA-HamidNeural',
      },
      { headers: nabdHeaders, timeout: 30000 }
    );
    
    return {
      audio_url: `${NABD_API_URL}${response.data.audio_url}`,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new HttpError(
        error.response?.status || 500,
        error.response?.data?.detail || 'TTS generation failed'
      );
    }
    throw new HttpError(500, 'Unexpected error occurred');
  }
}

/**
 * Upload image for vision analysis
 */
export async function uploadNabdImage(
  args: { file: Buffer; filename: string; contentType: string },
  context: Context
): Promise<{ imagePath: string }> {
  validateConfig();
  const user = validateAuth(context);
  validateSubscription(user);
  
  try {
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('file', args.file, {
      filename: args.filename,
      contentType: args.contentType,
    });
    
    const response = await axios.post(
      `${NABD_API_URL}/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-NABD-SECRET': NABD_SECRET_KEY || '',
        },
        timeout: 30000,
      }
    );
    
    return { imagePath: response.data.image_path };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new HttpError(
        error.response?.status || 500,
        error.response?.data?.detail || 'Image upload failed'
      );
    }
    throw new HttpError(500, 'Unexpected error occurred');
  }
}
