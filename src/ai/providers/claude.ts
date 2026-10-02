import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { AIError, type ProviderImpl } from '../llm';

function describeError(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'Ключ Claude не подходит (ошибка авторизации). Проверьте его в профиле.';
  if (e instanceof Anthropic.PermissionDeniedError) return 'У ключа нет доступа к этой модели.';
  if (e instanceof Anthropic.RateLimitError) return 'Слишком много запросов или закончился лимит. Попробуйте позже.';
  if (e instanceof Anthropic.BadRequestError) return `Ошибка запроса: ${e.message}`;
  if (e instanceof Anthropic.APIConnectionError) return 'Нет соединения с api.anthropic.com.';
  if (e instanceof Anthropic.APIError) return `Ошибка API (${e.status}): ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}

// Personal app: the user's own key, entered on their own device.
const client = (apiKey: string) => new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

export const claude: ProviderImpl = {
  async testKey(apiKey, model) {
    try {
      return (await client(apiKey).models.retrieve(model)).display_name;
    } catch (e) {
      throw new AIError(describeError(e));
    }
  },

  // Opus/Sonnet use server-side fallbacks so a (rare) refusal is retried on another model.
  async generate(apiKey, model, schema, system, user, maxTokens) {
    const isHaiku = model.startsWith('claude-haiku');
    try {
      const res = await client(apiKey).beta.messages.parse({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
        output_config: isHaiku ? { format: betaZodOutputFormat(schema) } : { format: betaZodOutputFormat(schema), effort: 'medium' },
        ...(isHaiku ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }),
      });
      if (res.stop_reason === 'refusal') throw new AIError('Модель отказалась выполнить запрос. Попробуйте другую формулировку.');
      if (res.stop_reason === 'max_tokens') throw new AIError('Ответ получился слишком длинным. Попробуйте ещё раз.');
      if (!res.parsed_output) throw new AIError('Не удалось разобрать ответ модели.');
      return res.parsed_output;
    } catch (e) {
      if (e instanceof AIError) throw e;
      throw new AIError(describeError(e));
    }
  },
};
