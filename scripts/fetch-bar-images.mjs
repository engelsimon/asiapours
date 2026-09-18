// Fetches the openly licensed photography used on /bars from Wikimedia
// Commons into public/images/bars/.
//
// This file is the provenance record. Every entry names the Commons file, the
// author and the license, and those three strings are what the `attribution`
// text on the page must match. Re-run with `node scripts/fetch-bar-images.mjs`
// if the images are ever lost.
//
// Only CC0 and CC BY files are listed here, deliberately. The page crops to a
// fixed aspect ratio, a crop is a derivative work, and a CC BY-SA source would
// pull share-alike obligations onto the rest of the site.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'bars');

const images = [
	{
		out: 'hong-kong.jpg',
		commonsFile: 'Hong Kong skyscrapers in a night of typhoon.jpg',
		author: 'Wilfredor',
		license: 'CC0',
	},
	{
		out: 'singapore.jpg',
		commonsFile: 'Central Business District skyline, Singapore, at night - 20140215-03.jpg',
		author: 'RM Bulseco',
		license: 'CC BY 2.0',
	},
	{
		out: 'bangkok.jpg',
		commonsFile: 'Nightshot At The Chao Phraya River (221664677).jpeg',
		author: 'Wolfgang Weber',
		license: 'CC BY 3.0',
	},
	{
		out: 'seoul.jpg',
		commonsFile: 'Yeouido Night View 2010.jpg',
		author: 'Bryan Dorrough',
		license: 'CC BY 2.0',
	},
	{
		out: 'tokyo.jpg',
		commonsFile: 'Minato City, Tokyo, Japan (Night).jpg',
		author: 'David Kernan',
		license: 'CC BY 4.0',
	},
	{
		// Landscape, unlike the Canton Tower portraits, which crop to a black
		// band with a sliver of tower in the page's 3:2 box.
		out: 'guangzhou.jpg',
		commonsFile: 'Guangzhou at night - 2017.jpg',
		author: 'Dairui Chen',
		license: 'CC0',
	},
	{
		// The only bar on the list with an openly licensed photograph of the
		// bar itself. Shows the door, which is what the caption says.
		out: 'bar-benfiddich.jpg',
		commonsFile: 'Benfiddich01.jpg',
		author: 'Keeezawa',
		license: 'CC0',
	},
];

// Commons resizes on request, so we never pull the 5 to 15 MB originals. It
// snaps to its own set of thumbnail widths rather than honoring this exactly,
// so asking for 1600 currently returns 1920. The `width` and `height` in the
// `cityImages` map in src/pages/bars.astro are the sizes actually delivered,
// so re-check them if this number changes.
const WIDTH = 1600;

await mkdir(outDir, { recursive: true });

for (const image of images) {
	const url =
		'https://commons.wikimedia.org/wiki/Special:FilePath/' +
		encodeURIComponent(image.commonsFile) +
		`?width=${WIDTH}`;

	const response = await fetch(url, {
		headers: { 'User-Agent': 'AsiaPours-static-site/1.0 (build script)' },
	});

	if (!response.ok) {
		console.error(`FAIL ${image.out}: ${response.status} ${response.statusText}`);
		continue;
	}

	const bytes = Buffer.from(await response.arrayBuffer());
	await writeFile(join(outDir, image.out), bytes);
	console.log(
		`OK   ${image.out}  ${(bytes.length / 1024).toFixed(0)} KB  ${image.author}, ${image.license}`
	);
}
