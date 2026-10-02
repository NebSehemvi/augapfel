import { ApiError, FinishReason, GoogleGenAI } from '@google/genai';
import { AIError, type ProviderImpl } from '../llm';
import { geminiJsonSchema } from '../jsonSchema';

function describeError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 400 && /API key/i.test(e.message)) return 'Ключ Gemini не подходит. Проверьте его в профиле.';
    if (e.status === 403) return 'У ключа нет доступа (403). Проверьте ключ и проект в AI Studio.';
    if (e.status === 404) return 'Модель не найдена — выберите другую модель Gemini в профиле.';
    if (e.status === 429) return 'Лимит запросов Gemini исчерпан (на бесплатном тарифе есть дневные лимиты). Попробуйте позже или выберите другую модель.';
    return `Ошибка Gemini API (${e.status}): ${e.message}`;
  }
  if (e instanceof TypeError) return 'Нет соединения с Gemini API.';
  return e instanceof Error ? e.message : String(e);
}

export const gemini: ProviderImpl = {
  async testKey(apiKey, model) {
    try {
      const m = await new GoogleGenAI({ apiKey }).models.get({ model });
      return m.displayName ?? model;
    } catch (e) {
      throw new AIError(describeError(e));
    }
  },

  async generate(apiKey, model, schema, system, user, maxTokens) {
    let text: string | undefined;
    try {
      const res = await new GoogleGenAI({ apiKey }).models.generateContent({
        model,
        contents: user,
        config: {
          systemInstruction: system,
          responseMimeType: 'application/json',
          responseJsonSchema: geminiJsonSchema(schema),
          maxOutputTokens: maxTokens,
        },
      });
      const reason = res.candidates?.[0]?.finishReason;
      if (reason === FinishReason.MAX_TOKENS) throw new AIError('Ответ получился слишком длинным. Попробуйте ещё раз.');
      if (reason === FinishReason.SAFETY || res.promptFeedback?.blockReason) throw new AIError('Gemini заблокировал ответ фильтром безопасности. Попробуйте другую тему.');
      text = res.text;
    } catch (e) {
      if (e instanceof AIError) throw e;
      throw new AIError(describeError(e));
    }
    if (!text) throw new AIError('Gemini вернул пустой ответ. Попробуйте ещё раз.');
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new AIError('Не удалось разобрать ответ Gemini (неверный JSON).');
    }
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new AIError('Ответ Gemini не соответствует ожидаемой структуре. Попробуйте ещё раз.');
    return parsed.data;
  },
};
