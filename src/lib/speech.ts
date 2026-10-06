/** Reads a German word aloud with the system voice (if the browser has one). */
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text: string) {
  if (!canSpeak) return;
  const u = new SpeechSynthesisUtterance(text.replace(' / ', ', ').replace(/ \(мн\.\)$/, ''));
  u.lang = 'de-DE';
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
