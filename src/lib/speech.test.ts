import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

it('requires a German voice, detects late voices and handles voice failure', async () => {
  const events = new EventTarget();
  let voices = [{ lang: 'en-US', voiceURI: 'en' }];
  let utterance: SpeechSynthesisUtterance;
  const synth = {
    getVoices: () => voices,
    addEventListener: events.addEventListener.bind(events),
    cancel: vi.fn(),
    speak: vi.fn((u: SpeechSynthesisUtterance) => { utterance = u; }),
  };
  vi.stubGlobal('window', { speechSynthesis: synth });
  vi.stubGlobal('SpeechSynthesisUtterance', class { constructor(public text: string) {} });
  const speech = await import('./speech');
  expect(speech.canSpeak).toBe(false);
  expect(await speech.speak('Hallo')).toBe(false);
  voices = [...voices, { lang: 'de-DE', voiceURI: 'de' }];
  events.dispatchEvent(new Event('voiceschanged'));
  expect(speech.canSpeak).toBe(true);
  const result = speech.speak('Hallo');
  expect(utterance!.voice).toBe(voices[1]);
  utterance!.onend!({} as SpeechSynthesisEvent);
  expect(await result).toBe(true);
  const blocked = speech.speak('Hallo');
  utterance!.onerror!({ error: 'not-allowed' } as SpeechSynthesisErrorEvent);
  expect(await blocked).toBe(false);
  expect(speech.canSpeak).toBe(true);
  const failed = speech.speak('Hallo');
  utterance!.onerror!({ error: 'voice-unavailable' } as SpeechSynthesisErrorEvent);
  expect(await failed).toBe(false);
  expect(speech.canSpeak).toBe(false);
});

it('works without the browser speech API', async () => {
  vi.stubGlobal('window', {});
  const speech = await import('./speech');
  expect(speech.canSpeak).toBe(false);
  expect(await speech.speak('Hallo')).toBe(false);
});
