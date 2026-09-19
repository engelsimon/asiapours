// MapLibre GL 6 parses vector tiles in a web worker, and it loads that worker
// as a separate file resolved relative to its own module URL. A bundler that
// inlines the library into one chunk breaks that assumption: the worker file
// is never emitted, `new Worker()` points at a URL that does not exist, and
// the failure is silent. No exception, no error event, just a map that draws
// its background and nothing else. That is the whole reason this script
// exists, and it took a while to find, so it is written down here.
//
// The fix is to serve the worker from a stable public path and point MapLibre
// at it with `setWorkerUrl`. Two files are needed, not one: the worker imports
// `./maplibre-gl-shared.mjs` as a sibling, so both have to land in the same
// directory or the worker fails to start for a different reason.
//
// This runs from `predev` and `prebuild`, so the copies regenerate after every
// `npm install` and track whatever version is in package.json. They are
// generated output and are gitignored: vendoring them by hand would mean a
// silent version skew the next time maplibre-gl is upgraded.

import { copyFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

// Resolved through the package rather than by guessing at node_modules, so a
// hoisted or pnpm-style layout still works.
const distDir = dirname(require.resolve('maplibre-gl/dist/maplibre-gl.mjs'));
const outDir = join(process.cwd(), 'public', 'vendor', 'maplibre');

const FILES = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

await mkdir(outDir, { recursive: true });
for (const file of FILES) {
	await copyFile(join(distDir, file), join(outDir, file));
}

console.log(`[maplibre] copied ${FILES.length} worker files to public/vendor/maplibre/`);
