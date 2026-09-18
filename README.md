# Asia Pours

Companion website to the printed Asia Pours booklet, a Gen A 2026 graduation
project for Asia Society Switzerland, presented at the State of Asia
conference on 5 November 2026. Built with Astro and Tailwind CSS v4.

## Local development

Requires Node.js 22.12 or later.

```sh
npm install
npm run dev
```

The site runs at `localhost:4321`.

Per `CLAUDE.md`, prefer running the dev server in background mode so it does
not block the terminal:

```sh
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

Other commands:

| Command             | Action                                       |
| :------------------- | :-------------------------------------------- |
| `npm run build`       | Build the production site to `./dist/`       |
| `npm run preview`     | Preview the production build locally          |
| `npm run astro ...`   | Run Astro CLI commands, e.g. `astro check`    |

## Deploying to asiapours.com (Vercel)

This is a fully static build, no server, adapter or environment variables
required. The drink finder matches recipes with client-side logic only.

Production deployment is GitHub → Vercel. United-domains is the domain
registrar for asiapours.com.

### One-time DNS cutover

Until this is done, asiapours.com does not serve the Vercel build. The domain
points at united-domains' own Apache hosting, which serves a build uploaded by
hand over FTP. The two paths are independent: pushing to `main` updates the
Vercel deployment and does not change what the live domain serves.

1. In the Vercel project, add `asiapours.com` under Settings → Domains.
   Vercel then displays the exact DNS records to set. Use the records it
   shows rather than any value written down here, since they are per-project
   and do change.

2. In united-domains' DNS settings for asiapours.com, replace the existing
   `A` record, which points at the old Apache host, with what Vercel asked
   for. Propagation can take a few hours.

3. Vercel provisions and renews the HTTPS certificate automatically once DNS
   points at it, nothing to configure by hand.

4. Confirm the cutover landed. `curl -sI https://asiapours.com | grep -i server`
   should report `Vercel`, not `Apache`. That header is the quickest way to
   tell which host actually answered.

5. The old FTP hosting can then be cancelled or left alone. Nothing deploys to
   it any more, but until DNS moves it is still what visitors see.

### Routine deployment, after the cutover

1. Push to the `main` branch, or merge a pull request into it. Vercel builds
   with `npm run build` and deploys automatically, no manual upload step.

2. Visit https://asiapours.com and spot-check the homepage, a recipe page,
   `/finder`, and `/bars`.

## Adding a bar

One Markdown file per bar in `src/content/bars/`. Copy
`src/content/bars/TEMPLATE.md.example`, rename it to `<slug>.md`, fill it in.
The list sorts by `rank`, so unranked bars fall to the bottom.

Coordinates are the only fiddly part. Search the address on
[openstreetmap.org](https://www.openstreetmap.org), right click the spot,
choose "Show address", and read the pair out of the left panel. `lat` and
`lng` must be plain numbers, not quoted strings, or the build fails. A bar
with no valid coordinates is left off the map.

Two fields carry text, and the split is deliberate:

- **`context`** is the sourced description. Everything in it must trace to
  whatever `source` names, per editorial rule 1. For the eleven seeded bars
  that is The World's 50 Best Bars 2025.
- **`note`** is your own comment, and the one place opinion belongs. It
  renders under a brass "From the visit" rule so a reader can always tell
  your voice from a citation. Optional; omit the field and nothing renders.

For a bar you went to yourself, `source` is simply you, for example
`"Visited by Simon Engel, March 2026"`.

Omit `signatureCocktail` entirely when a bar has no single named drink
rather than inventing one. Bar Us, Hope & Sesame and The Bellwood already
omit it, and the page's sourcing note discloses that.

`relatedIngredients` accepts any of `ube`, `yuzu`, `matcha` and renders a
link to that chapter. Leave it `[]` unless the connection is real.

### Photography on this page

Two kinds of image appear on `/bars`, and they are not interchangeable.

The large photograph at the head of each city section is of the **city**, not
of any bar. Those come from Wikimedia Commons and are declared in the
`cityImages` map at the top of `src/pages/bars.astro`. The per-bar `image`
field is the only place a photograph of an actual bar belongs.

A press photo, a photo from the bar's own website, or anything off the50.com
is copyrighted. Adding a credit line does not license it. Only use an image
you can point to a license for, or one you took yourself.

Prefer **CC0** or **CC BY**, and avoid **CC BY-SA**. The page crops images to
a fixed aspect, a crop is a derivative work, and share-alike would then reach
the rest of the site. Wikimedia Commons exposes the license through its API:

```
https://commons.wikimedia.org/w/api.php?action=query&generator=search
  &gsrsearch=filetype:bitmap%20<query>&gsrlimit=8&gsrnamespace=6
  &prop=imageinfo&iiprop=url|size|extmetadata
  &iiextmetadatafilter=LicenseShortName|Artist&format=json&formatversion=2
```

Per CLAUDE.md rule 5, every image carries either an AI-generated caption or a
real attribution, never neither. For a Commons file the `attribution` string
is `"Photo: <author>, <license>, via Wikimedia Commons."`. For your own photo
it is `"Photo: Simon Engel"`.

Save files into `public/images/bars/`. The site serves them as plain JPEGs,
so pass `webp={false}` unless you also generate a `.webp` sibling.

## Project structure

```text
/
├── public/                  static assets, favicon, robots.txt, sitemap.xml
├── source-material/         booklet PDF and AI-generated photography (source of truth for content)
├── src/
│   ├── components/
│   ├── content/              recipe, ingredient and bar content collections
│   ├── layouts/
│   ├── pages/
│   │   ├── finder.astro      drink finder, matches recipes client-side
│   │   ├── bars.astro        bars map (Leaflet, OpenStreetMap tiles) and list
│   │   └── recipes/[slug].astro
│   └── styles/global.css     Tailwind v4 theme tokens and print stylesheet
└── astro.config.mjs
```

See `CLAUDE.md` for editorial rules, brand tokens, and design rules that
govern content and styling decisions on this site.
