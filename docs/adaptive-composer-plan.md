# Adaptive composer plan

## Goal

One adaptive translator flow. Input source changes; the product always returns a translation card.

## Current state

- UI: Voice / Type / Screenshot tabs in `components/male-translator.tsx`
- Client: local dictionary first, then `POST /api/translate` for `aiInsight` only
- Screenshot: separate `POST /api/analyze-screenshot`
- Voice: `POST /api/transcribe` → client translate

## Target architecture

### UI

- Replace mode tabs with `AdaptiveComposer` (text + photo + voice in one footprint)
- Extract: `PresetChips`, `AttachmentPreview`, `VoiceRecorderState`, `TranslationResultCard`
- Keep Men/Women receiver toggle, presets, playful glass aesthetic

### Pipeline

1. Classify input: short (<~200 chars / <3 sentences) vs long (>~300 / rant-like)
2. Short → dictionary translate phrase; AI analysis async
3. Long → extract one phrase (AI or heuristic); translate only that; analysis below card
4. Image is attachment context (or sole source when no text)

### API

Unify on `POST /api/translate`:

- JSON: `{ text, direction, inputSource?, sarcasmLevel, gruntMode }`
- Multipart: same fields + optional `image`
- Response extends `TranslationResult` with `mode`, `extractedPhrase?`, `analysis?`

Keep `/api/transcribe` and `/api/speech`. Keep `/api/analyze-screenshot` as a thin wrapper over shared pipeline helpers for compatibility.

### Files

| Area | Touch |
|------|--------|
| Classifier / prompts / pipeline | `lib/input-classifier.ts`, `lib/translate-prompts.ts`, `lib/translate-pipeline.ts` |
| Types | `lib/translator.ts`, `lib/translation-types.ts` |
| API | `app/api/translate/route.ts` (+ shared helpers used by screenshot route) |
| UI | new composer components; slim `male-translator.tsx` |
| Presets | `lib/translations.ts` sample phrases |
| Tests | `scripts/test-translate.ts` + classifier smoke script |
