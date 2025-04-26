/**
 * !!! DNA PROTECTED SERVICE - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - AI SERVICE INTERFACE
 * Front-end interface for interacting with the OpenAI service backend.
 * 
 * FEATURES:
 * - Secure AI completions with DNA watermarking
 * - Self-protecting API calls
 * - Image generation with copyright protection
 * - Audio transcription with security verification
 * 
 * ANTI-THEFT NOTICE:
 * This component is part of a unified integrated security system with
 * DNA-based verification. All components are built together as one
 * single unit from the beginning.
 */

import axios from 'axios';
import { 
  IMMUTABLE_COPYRIGHT_OWNER,
  IMMUTABLE_COPYRIGHT_EMAIL,
  IMMUTABLE_SYSTEM_VERSION,
  generateDNASignature,
  validateDNASignature
} from './dna-security-core';
import { registerProtectedComponent } from './dna-protection-system';

// Register this component with the DNA protection system
const componentId = 'ai-service-client';
const serviceProtection = registerProtectedComponent(
  componentId, 
  'client-service'
);

// API endpoints
const AI_COMPLETION_ENDPOINT = '/api/ai/completion';
const AI_IMAGE_ENDPOINT = '/api/ai/image';
const AI_TRANSCRIPTION_ENDPOINT = '/api/ai/transcription';

/**
 * Interface for AI completion parameters
 */
export interface AICompletionParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

/**
 * Interface for AI completion result
 */
export interface AICompletionResult {
  id: string;
  text: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  createdAt: string;
  dnaSignature: string;
  watermark: string;
  verificationChain: string;
}

/**
 * Generate an AI completion using the OpenAI service
 * @param params AI completion parameters
 * @returns Promise resolving to the AI completion result
 */
export async function generateAICompletion(
  params: AICompletionParams
): Promise<AICompletionResult> {
  try {
    // Generate a secure client-side signature for the request
    const requestId = `ai-req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const clientSignature = generateDNASignature(requestId, 'ai-request');
    
    // Make the API request
    const response = await axios.post(AI_COMPLETION_ENDPOINT, {
      ...params,
      clientSignature,
      clientWatermark: serviceProtection.watermark,
      timestamp: new Date().toISOString()
    });
    
    const result = response.data;
    
    // Validate the DNA signature of the response
    if (!validateDNASignature(result.dnaSignature, result.id, 'ai-completion')) {
      throw new Error('AI completion response failed DNA signature validation');
    }
    
    // Return the validated result
    return result;
  } catch (error) {
    console.error('AI completion error:', error);
    
    // Return a protected error result
    return {
      id: `error-${Date.now()}`,
      text: `AI completion failed: ${error.message}`,
      model: 'error',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      createdAt: new Date().toISOString(),
      dnaSignature: generateDNASignature(`error-${Date.now()}`, 'ai-completion'),
      watermark: serviceProtection.watermark,
      verificationChain: 'error'
    };
  }
}

/**
 * Interface for AI image generation parameters
 */
export interface AIImageGenerationParams {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  style?: 'vivid' | 'natural';
  quality?: 'standard' | 'hd';
}

/**
 * Interface for AI image generation result
 */
export interface AIImageGenerationResult {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  dnaSignature: string;
  watermark: string;
  verificationChain: string;
}

/**
 * Generate an image using the OpenAI DALL-E service
 * @param params AI image generation parameters
 * @returns Promise resolving to the AI image generation result
 */
export async function generateAIImage(
  params: AIImageGenerationParams
): Promise<AIImageGenerationResult> {
  try {
    // Generate a secure client-side signature for the request
    const requestId = `img-req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const clientSignature = generateDNASignature(requestId, 'image-request');
    
    // Make the API request
    const response = await axios.post(AI_IMAGE_ENDPOINT, {
      ...params,
      clientSignature,
      clientWatermark: serviceProtection.watermark,
      timestamp: new Date().toISOString()
    });
    
    const result = response.data;
    
    // Validate the DNA signature of the response
    if (!validateDNASignature(result.dnaSignature, result.id, 'ai-image')) {
      throw new Error('AI image generation response failed DNA signature validation');
    }
    
    // Return the validated result
    return result;
  } catch (error) {
    console.error('AI image generation error:', error);
    
    // Return a protected error result
    return {
      id: `error-${Date.now()}`,
      url: '',
      prompt: params.prompt,
      createdAt: new Date().toISOString(),
      dnaSignature: generateDNASignature(`error-${Date.now()}`, 'ai-image'),
      watermark: serviceProtection.watermark,
      verificationChain: 'error'
    };
  }
}

/**
 * Interface for AI audio transcription parameters
 */
export interface AITranscriptionParams {
  audioFile: File;
  language?: string;
  prompt?: string;
}

/**
 * Interface for AI audio transcription result
 */
export interface AITranscriptionResult {
  id: string;
  text: string;
  language: string;
  durationSeconds?: number;
  createdAt: string;
  dnaSignature: string;
  watermark: string;
  verificationChain: string;
}

/**
 * Transcribe audio using the OpenAI Whisper service
 * @param params AI audio transcription parameters
 * @returns Promise resolving to the AI transcription result
 */
export async function transcribeAudio(
  params: AITranscriptionParams
): Promise<AITranscriptionResult> {
  try {
    // Generate a secure client-side signature for the request
    const requestId = `trans-req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const clientSignature = generateDNASignature(requestId, 'transcription-request');
    
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('audioFile', params.audioFile);
    formData.append('language', params.language || 'en');
    if (params.prompt) formData.append('prompt', params.prompt);
    formData.append('clientSignature', clientSignature);
    formData.append('clientWatermark', serviceProtection.watermark);
    formData.append('timestamp', new Date().toISOString());
    
    // Make the API request
    const response = await axios.post(AI_TRANSCRIPTION_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const result = response.data;
    
    // Validate the DNA signature of the response
    if (!validateDNASignature(result.dnaSignature, result.id, 'ai-transcription')) {
      throw new Error('AI transcription response failed DNA signature validation');
    }
    
    // Return the validated result
    return result;
  } catch (error) {
    console.error('AI transcription error:', error);
    
    // Return a protected error result
    return {
      id: `error-${Date.now()}`,
      text: `Transcription failed: ${error.message}`,
      language: 'en',
      createdAt: new Date().toISOString(),
      dnaSignature: generateDNASignature(`error-${Date.now()}`, 'ai-transcription'),
      watermark: serviceProtection.watermark,
      verificationChain: 'error'
    };
  }
}