import { useSyncExternalStore } from 'react';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
const listeners = new Set<() => void>();
const failed = new Set<string>();
let voice: SpeechSynthesisVoice | undefined;
/** Live binding for exercise generators; React views should use useCanSpeak. */
export let canSpeak = false;

function refresh() {
  voice = synth?.getVoices().find((v) => v.lang.toLowerCase().startsWith('de') && !failed.has(v.voiceURI));
  const available = !!voice;
  if (available !== canSpeak) {
    canSpeak = available;
    listeners.forEach((notify) => notify());
  }
}

synth?.addEventListener('voiceschanged', refresh);
refresh();

function subscribe(notify: () => void) {
  listeners.add(notify);
  refresh();
  return () => { listeners.delete(notify); };
}

export function useCanSpeak() {
  return useSyncExternalStore(subscribe, () => canSpeak, () => false);
}

/** Returns false on failure; cancellation and autoplay restrictions can be retried by tapping. */
export function speak(text: string): Promise<boolean> {
  refresh();
  if (!synth || !voice) return Promise.resolve(false);
  const selected = voice;
  return new Promise((resolve) => {
    const fail = () => {
      failed.add(selected.voiceURI);
      refresh();
      resolve(false);
    };
    try {
      const u = new SpeechSynthesisUtterance(text.replace(' / ', ', ').replace(/ \(мн\.\)$/, ''));
      u.voice = selected;
      u.lang = selected.lang;
      u.rate = 0.9;
      u.onend = () => resolve(true);
      u.onerror = (e) => {
        if (['canceled', 'interrupted', 'not-allowed'].includes(e.error)) resolve(false);
        else fail();
      };
      synth.cancel();
      synth.speak(u);
    } catch {
      fail();
    }
  });
}
