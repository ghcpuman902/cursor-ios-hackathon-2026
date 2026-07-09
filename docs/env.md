# Environment variables

## Files

| File           | Committed | Purpose                                   |
| -------------- | --------- | ----------------------------------------- |
| `.env.example` | Yes       | Documented placeholders for collaborators |
| `.env.local`   | No        | Local secrets and overrides               |
| `.env.*.local` | No        | Environment-specific local overrides      |

## Local setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with real values. Never commit it.

## AI Gateway authentication

AI-supplemented translations, audio transcription, and speech generation use
Vercel AI Gateway. Translation requests run the local dictionary first and
show that reply as the primary result; when Gateway generation is available it
adds a short AI analysis note underneath, and it is simply omitted otherwise.

- Vercel deployments use the automatically provided `VERCEL_OIDC_TOKEN`.
- Local development uses `AI_GATEWAY_API_KEY`. Create a key in the
  [AI Gateway dashboard](https://vercel.com/ai-gateway) and add it to
  `.env.local`.
- Male and female satire modes default to the `onyx` and `nova` speech voices.
  Override them independently, or set `AI_GATEWAY_SPEECH_VOICE` to force one
  voice for both modes. All model and voice overrides are documented in
  `.env.example`.

## Next.js conventions

- `NEXT_PUBLIC_*` — exposed to the browser; use only for non-sensitive public config.
- All other variables — server-only by default in App Router.

## Adding new variables

1. Add a commented placeholder to `.env.example`.
2. Document usage in code or `docs/setup.md` if non-obvious.
3. Add the value in Vercel project settings for preview/production.
4. Pull with `vercel env pull .env.local` when using Vercel CLI.

## Validation (optional)

Use Zod in `lib/env.ts` to validate required env vars at startup when your app grows:

```ts
import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)
```

## Security

- Do not log secrets.
- Do not put API keys in `NEXT_PUBLIC_*` variables.
- Rotate keys if accidentally committed; use gitignored scratch files for recovery notes.
