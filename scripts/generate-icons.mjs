// Generates every raster icon from the one vector mark, so there is a single
// source of truth for the logo. Run with `npm run generate-icons`.
//
// The path data below must stay in sync with public/favicon.svg and
// src/components/Mark.astro. Those two are hand-edited SVG because they need
// `currentColor` and a `prefers-color-scheme` rule, which cannot survive
// rasterization. This file bakes explicit colors instead.
//
// Outputs (all into public/):
//   apple-touch-icon.png  180  iOS home screen, needs an opaque background
//   icon-192.png          192  web app manifest
//   icon-512.png          512  web app manifest, splash screens
//   favicon.ico            32  legacy browsers and some feed readers
//   og-default.jpg    1200x630 social card, the default for pages that set none

import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Brand tokens, copied from src/styles/global.css. Kept literal here because
// this script runs outside the Tailwind build and cannot read the @theme block.
const SLATE = '#15191F';
const BONE = '#E8E3DA';
const BRASS = '#C9A55F';

const GLASS =
	'M9.9 6 L118.1 6 L67.5 62 L67.5 112 C67.5 117 72 120 92.9 122 L35.1 122 C56 120 60.5 117 60.5 112 L60.5 62 Z';
const LIQUID = 'M33.4 32 L94.6 32';
const SUN = 'M44 32 a14.4 14.4 0 0 1 28.8 0 Z';
// The leaf is a lens drawn in its own local coordinates and then rotated into
// place. Drawn directly as an arc between two diagonal points, the sweep flags
// put the bulge on the side facing the bowl wall and the two shapes merged.
const LEAF_TRANSFORM = 'translate(76,38) rotate(-45)';
const LEAF = 'M-16 0 A24.33 24.33 0 0 1 16 0 A24.33 24.33 0 0 1 -16 0 Z';

/**
 * @param {object} opts
 * @param {string} opts.fg     color for the glass outline and the leaf
 * @param {string} [opts.bg]   opaque background, omit for transparency
 * @param {number} [opts.pad]  padding in viewBox units, breathing room for
 *                             iOS which crops touch icons to a rounded square
 */
function markSvg({ fg, bg, pad = 0 }) {
	const min = -pad;
	const span = 128 + pad * 2;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${min} ${min} ${span} ${span}" fill="none">
${bg ? `<rect x="${min}" y="${min}" width="${span}" height="${span}" fill="${bg}"/>` : ''}
<g stroke="${fg}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<path d="${GLASS}"/>
<path d="${LIQUID}"/>
</g>
<path d="${SUN}" fill="${BRASS}"/>
<g transform="${LEAF_TRANSFORM}"><path d="${LEAF}" fill="${fg}"/></g>
</svg>`;
}

// High density so librsvg rasterizes at a large size and downsamples, rather
// than hinting a 32px render into mush.
const render = (svg, size) =>
	sharp(Buffer.from(svg), { density: 900 }).resize(size, size).png();

/**
 * Minimal single-image .ico container. sharp cannot write ICO, and pulling a
 * dependency in for a 22 byte header is not worth it. An ICO whose payload is
 * a PNG has been valid since Vista and is what every icon generator emits now.
 */
function icoFromPng(png) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type 1 = icon
	header.writeUInt16LE(1, 4); // one image
	const entry = Buffer.alloc(16);
	entry.writeUInt8(32, 0); // width, 32px
	entry.writeUInt8(32, 1); // height
	entry.writeUInt8(0, 2); // palette size, 0 = truecolor
	entry.writeUInt8(0, 3); // reserved
	entry.writeUInt16LE(1, 4); // color planes
	entry.writeUInt16LE(32, 6); // bits per pixel
	entry.writeUInt32LE(png.length, 8);
	entry.writeUInt32LE(header.length + entry.length, 12); // payload offset
	return Buffer.concat([header, entry, png]);
}

async function main() {
	// Touch and manifest icons sit on slate. The site is dark by default and an
	// iOS home screen icon has no transparency to fall back on, so baking the
	// background is the only way to keep the mark legible.
	// pad is in viewBox units and the mark already spans 6 to 122 of 128, so a
	// small number goes a long way here.
	const onSlate = markSvg({ fg: BONE, bg: SLATE, pad: 14 });

	await render(onSlate, 180).toFile(join(PUBLIC, 'apple-touch-icon.png'));
	await render(onSlate, 192).toFile(join(PUBLIC, 'icon-192.png'));
	await render(onSlate, 512).toFile(join(PUBLIC, 'icon-512.png'));

	// The .ico is the legacy fallback and shows at 16 or 32px against a tab
	// strip of unknown color, so it gets the same slate plate rather than
	// transparency, which would leave a bone glass invisible on white.
	const icoPng = await render(markSvg({ fg: BONE, bg: SLATE, pad: 6 }), 32).toBuffer();
	await writeFile(join(PUBLIC, 'favicon.ico'), icoFromPng(icoPng));

	// Social card. No text: Fraunces and Inter are self-hosted woff2 inside
	// node_modules and are not visible to the rasterizer's font stack, so any
	// wordmark here would silently fall back to a third typeface and break the
	// two-family rule. The mark alone, on slate, with a brass hairline.
	const card = 1200;
	const cardH = 630;
	const mark = await render(markSvg({ fg: BONE }), 260).toBuffer();
	const hairline = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${card}" height="${cardH}">
<rect x="0" y="0" width="${card}" height="2" fill="${BRASS}"/>
</svg>`,
	);
	await sharp({
		create: {
			width: card,
			height: cardH,
			channels: 3,
			background: SLATE,
		},
	})
		.composite([
			{ input: hairline, top: 0, left: 0 },
			{ input: mark, top: Math.round((cardH - 260) / 2), left: Math.round((card - 260) / 2) },
		])
		.jpeg({ quality: 88 })
		.toFile(join(PUBLIC, 'og-default.jpg'));

	console.log('Wrote apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico, og-default.jpg');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
