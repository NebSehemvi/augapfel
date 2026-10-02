import { useSyncExternalStore } from 'react';
import type { z } from 'zod';

/*
 * Optional AI providers (Claude or Gemini). Keys are stored only in this browser's localStorage
 * (never in the progress export); requests go straight from the browser to the provider's API.
 * Prompts and output validation are shared — a provider only has to return JSON matching a schema.
 */

export type Provider = 'claude' | 'gemini';

export interface ModelOption {
  id: string;
  label: string;
  note: string;
}

export const PROVIDERS: Record<Provider, { label: string; keyUrl: string; keyHint: string; models: ModelOption[] }> = {
  claude: {
    label: 'Claude',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyHint: 'sk-ant-…',
    models: [
      { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', note: 'лучшее качество немецкого · ≈ $0.06–0.10 за генерацию' },
      { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', note: 'быстрее и дешевле · ≈ $0.03 за генерацию' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', note: 'самый дешёвый · ≈ $0.015 за генерацию' },
    ],
  },
  gemini: {
    label: 'Gemini',
    keyUrl: 'https://aistudio.google.com/api-keys',
    keyHint: 'AIza…',
    models: [
      { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', note: 'есть бесплатный тариф · платно ≈ $0.013 за генерацию' },
      { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite', note: 'есть бесплатный тариф · самый дешёвый, качество ниже' },
      { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (preview)', note: 'только платно · ≈ $0.04 за генерацию' },
    ],
  },
};

export interface AISettings {
  provider: Provider;
  keys: Record<Provider, string>;
  models: Record<Provider, string>;
}

const KEY = 'augapfel.ai.v1';
const OLD_CLAUDE_KEY = 'augapfel.claude.v1';

function defaults(): AISettings {
  return {
    provider: 'claude',
    keys: { claude: '', gemini: '' },
    models: { claude: PROVIDERS.claude.models[0].id, gemini: PROVIDERS.gemini.models[0].id },
  };
}

function load(): AISettings {
  const base = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Partial<AISettings>;
      return { provider: s.provider ?? base.provider, keys: { ...base.keys, ...s.keys }, models: { ...base.models, ...s.models } };
    }
    // migrate the earlier Claude-only settings
    const old = localStorage.getItem(OLD_CLAUDE_KEY);
    if (old) {
      const o = JSON.parse(old) as { apiKey?: string; model?: string };
      return { ...base, keys: { ...base.keys, claude: o.apiKey ?? '' }, models: { ...base.models, claude: o.model ?? base.models.claude } };
    }
  } catch {
    // unavailable storage
  }
  return base;
}

let state = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    if (state.keys.claude || state.keys.gemini) localStorage.setItem(KEY, JSON.stringify(state));
    else localStorage.removeItem(KEY);
    localStorage.removeItem(OLD_CLAUDE_KEY);
  } catch {
    // ignore
  }
}

export function getAISettings() {
  return state;
}

export function setProvider(provider: Provider) {
  state = { ...state, provider };
  persist();
  listeners.forEach((l) => l());
}

export function setKey(provider: Provider, key: string) {
  state = { ...state, keys: { ...state.keys, [provider]: key } };
  persist();
  listeners.forEach((l) => l());
}

export function setModel(provider: Provider, model: string) {
  state = { ...state, models: { ...state.models, [provider]: model } };
  persist();
  listeners.forEach((l) => l());
}

export function useAISettings(): AISettings {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

/** Is the selected provider ready to use (has a key)? */
export const aiReady = (s: AISettings = state) => !!s.keys[s.provider];
export const providerLabel = (s: AISettings = state) => PROVIDERS[s.provider].label;

// ---------------------------------------------------------------------------

export class AIError extends Error {}

export interface ProviderImpl {
  testKey(apiKey: string, model: string): Promise<string>;
  generate<T extends z.ZodType>(apiKey: string, model: string, schema: T, system: string, user: string, maxTokens: number): Promise<z.infer<T>>;
}

async function impl(p: Provider): Promise<ProviderImpl> {
  return p === 'claude' ? (await import('./providers/claude')).claude : (await import('./providers/gemini')).gemini;
}

/** Cheap key check for a provider (reads model metadata, no tokens used). */
export async function testKey(p: Provider): Promise<string> {
  return (await impl(p)).testKey(state.keys[p], state.models[p]);
}

/** One structured-output request to the selected provider; the result matches `schema`. */
export async function generate<T extends z.ZodType>(schema: T, system: string, user: string, maxTokens = 16000): Promise<z.infer<T>> {
  const p = state.provider;
  if (!state.keys[p]) throw new AIError(`Добавьте ключ ${PROVIDERS[p].label} в профиле.`);
  return (await impl(p)).generate(state.keys[p], state.models[p], schema, system, user, maxTokens);
}
