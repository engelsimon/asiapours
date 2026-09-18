## Project

Asia Pours is a companion website to a printed booklet: a Gen A 2026 graduation
project for Asia Society Switzerland, presented at the State of Asia conference
on 5 November 2026. Author: Simon Engel. Audience: Swiss and German executives.

The thesis: a cocktail is the smallest usable unit of cultural fluency. Three
Asian ingredients (ube, yuzu, matcha) each illustrate a different supply-chain
governance pattern that matters to anyone doing business in Asia.

## Editorial rules, non-negotiable

1. Never invent a fact, figure, date, quote or source. All content comes from
   source-material/. If something is needed that is not there, insert
   `[VERIFY: description]` and tell me. Do not fill the gap with plausible text.
2. Every number on the site traces to a named source. No orphan statistics.
3. US English spelling throughout.
4. Register is dry and understated, never jokey and never marketing-speak.
   Reference sentence: "The bath is said to keep colds away for a year. Nobody
   checks." Avoid: "delve", "unlock", "elevate", "journey", "game-changer",
   exclamation marks, and rhetorical questions as headings.
5. All photography on the original booklet pages (home, chapters, recipes) is
   AI generated and must be captioned as such. This is not optional and not a
   footnote. The Bars page (/bars) may also carry real photography of bars
   and drinks; when it does, the image must carry a proper copyright or
   photographer credit instead of an AI-generated caption. Every image on the
   site must be one or the other, an AI-generated caption or a real
   attribution, never uncaptioned.
6. Never write em dashes or en dashes. Use commas, colons or full stops.

## Source material

`source-material/` at the project root contains `Asia_Pours_Booklet.pdf` (the
full booklet, text and figures) and `source-material/images/` (the nine AI
generated photographs used in the booklet, already extracted and renamed by
subject). `Asia_Pours_Sources.docx` (the formal APA source list for /sources)
is not yet present. Treat any reference-page claim that needs it as
`[VERIFY: needs Asia_Pours_Sources.docx]` until it is added.

## Technical rules

- No API keys in client-side code, ever. Anything needing a key goes through a
  server endpoint.
- No external analytics or tracking scripts without asking first.
- Prefer static generation. Add client-side JavaScript only where an island
  genuinely needs it, using Astro's `client:visible` where possible.
- Accessibility: semantic HTML, real heading hierarchy, alt text on every image,
  visible focus states, WCAG AA contrast minimum.

## Brand tokens

This project uses Tailwind CSS v4, which is CSS-first: there is no
`tailwind.config.js`. Theme tokens live in `src/styles/global.css` inside an
`@theme` block and are consumed as utility classes (e.g. `bg-slate`,
`text-bone`, `border-ube`) exactly as a JS config's `theme.extend.colors`
would be. The site is dark by default.

| Token  | Hex     | Use |
|--------|---------|-----|
| slate  | #15191F | page background |
| stone  | #1E232B | raised surfaces, cards, callouts |
| rule   | #333A44 | hairlines and borders |
| bone   | #E8E3DA | body text |
| ash    | #A9A399 | secondary text |
| mist   | #7A756D | captions and metadata |
| brass  | #C9A55F | accent, hairlines and labels only, never body text |
| ube    | #A974C9 | chapter one |
| yuzu   | #E0B03C | chapter two |
| matcha | #8CA85A | chapter three |
| steel  | #7C9CBF | institutional / links |

Type: `--font-serif` (Fraunces) for all reading text and headings,
`--font-sans` (Inter) used only in uppercase with wide letter-spacing
(`.font-label` utility) for labels and eyebrows. Never a third family. Fonts
are self-hosted via `@fontsource/fraunces` and `@fontsource/inter`, imported
in `src/styles/global.css`. No Google Fonts CDN.

## Design rules

- Ranged left, never justified. Centered only on the hero.
- One ingredient accent color per page section, taken from that ingredient.
- Brass for hairlines and small labels only.
- Generous whitespace. No drop shadows, no gradients, no rounded corners beyond
  2px (`--radius-*` is capped at 2px in the theme), no icon sets, no stock
  illustration.
- Recipe photography is 4:5 portrait. Origin photography is 3:2 landscape.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
