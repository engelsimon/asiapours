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

## Deploying to asiapours.com (FTP)

This is a fully static build, no server or environment variables required.
The drink finder matches recipes with client-side logic only.

1. Build the site:

   ```sh
   npm run build
   ```

   This produces static files in `./dist/` (HTML, CSS, JS, images). There is
   no `dist/server/` directory, nothing needs to run continuously.

2. Open FileZilla and connect using the FTP credentials from the hosting
   control panel (host, username, password, port — usually 21).

3. In the remote pane, navigate to the web root (commonly `public_html/` or
   `htdocs/`, confirm the exact name in the hosting control panel).

4. In the local pane, open `dist/` and upload its **contents** (not the
   `dist` folder itself) into the web root.

5. Once the transfer finishes, visit https://asiapours.com and spot-check
   the homepage, a recipe page, and `/finder`. If the domain doesn't resolve
   yet, confirm DNS is pointed at the hosting account; propagation can take
   a few hours after a change.

Re-run `npm run build` and re-upload the `dist/` contents any time the site
changes.

## Project structure

```text
/
├── public/                  static assets, favicon, robots.txt, sitemap.xml
├── source-material/         booklet PDF and AI-generated photography (source of truth for content)
├── src/
│   ├── components/
│   ├── content/              recipe and ingredient content collections
│   ├── layouts/
│   ├── pages/
│   │   ├── finder.astro      drink finder, matches recipes client-side
│   │   └── recipes/[slug].astro
│   └── styles/global.css     Tailwind v4 theme tokens and print stylesheet
└── astro.config.mjs
```

See `CLAUDE.md` for editorial rules, brand tokens, and design rules that
govern content and styling decisions on this site.
