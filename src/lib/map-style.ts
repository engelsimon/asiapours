import type { StyleSpecification } from 'maplibre-gl';

// The basemap style for /bars.
//
// This is written from scratch against the OpenMapTiles schema rather than
// adapted from OpenFreeMap's own dark style. Theirs is 47 layers covering
// roads, buildings, landuse, aeroways and points of interest, none of which
// this page uses: the map answers "which cities, roughly where", and the
// street a bar sits on is printed on its card. Recoloring 47 layers to hide
// 43 of them would leave a large style to maintain and a lot of tile data
// being drawn for nothing. Four layers is the whole map.
//
// Every color here is a brand token, not a hex chosen for the map. Land takes
// `stone`, the same value as every raised surface on the site, and water takes
// `slate`, the page background, so the sea reads as the page showing through
// and the landmass as a panel sitting on it. That is the inverse of most dark
// maps, which sink the water. It is deliberate: on this page the land is the
// subject and the Pacific is half the frame.
//
// Labels are forced to `name:latin`. The default is `name`, which renders each
// place in its own script, so the previous map showed Cyrillic, Arabic, Han
// and Thai in one frame. That is honest cartography and the wrong call for a
// booklet read by a German and Swiss audience.

// OpenFreeMap serves these without an API key, registration or cookies, which
// is why it is usable here at all: project rule forbids client-side API keys.
// Attribution below is required and is rendered by MapLibre's control.
const TILES = 'https://tiles.openfreemap.org/planet';
const GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';

// The only fontstack OpenFreeMap serves. The site's label face is Inter and
// cannot be used here, because map glyphs are pre-rendered signed distance
// fields on the tile server, not webfonts. Noto Sans in uppercase with wide
// tracking lands close enough to `.font-label` that the map does not read as
// a third type family.
const FONT = ['Noto Sans Regular'];

const SLATE = '#15191F';
const STONE = '#1E232B';
const RULE = '#333A44';
const MIST = '#7A756D';

export const mapStyle: StyleSpecification = {
	version: 8,
	glyphs: GLYPHS,
	sources: {
		openmaptiles: { type: 'vector', url: TILES },
	},
	layers: [
		// Land. Drawn as a background fill rather than a landcover layer: the
		// schema has no single "land" polygon, so the convention is to paint
		// everything and cut the water out on top.
		{
			id: 'land',
			type: 'background',
			paint: { 'background-color': STONE },
		},
		{
			id: 'water',
			type: 'fill',
			source: 'openmaptiles',
			'source-layer': 'water',
			// Tunnels are in the water layer and would draw a river across dry
			// land at this scale.
			filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['!=', ['get', 'brunnel'], 'tunnel']],
			paint: { 'fill-color': SLATE, 'fill-antialias': false },
		},
		// Country outlines only. Disputed borders are excluded rather than
		// taken a position on: this is a drinks booklet.
		{
			id: 'boundary-country',
			type: 'line',
			source: 'openmaptiles',
			'source-layer': 'boundary',
			filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
			paint: {
				'line-color': RULE,
				'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 8, 1.2],
			},
		},
		{
			id: 'place-labels',
			type: 'symbol',
			source: 'openmaptiles',
			'source-layer': 'place',
			// Countries until the reader zooms past the continental view, then
			// cities. Showing both at once crowds a frame this dark.
			filter: [
				'any',
				['all', ['==', ['get', 'class'], 'country'], ['<=', ['zoom'], 5]],
				['all', ['==', ['get', 'class'], 'city'], ['>', ['zoom'], 3]],
			],
			layout: {
				'text-field': ['coalesce', ['get', 'name:latin'], ['get', 'name']],
				'text-font': FONT,
				'text-size': ['case', ['==', ['get', 'class'], 'country'], 10, 9],
				'text-transform': 'uppercase',
				'text-letter-spacing': 0.18,
				'text-max-width': 7,
				'text-padding': 6,
			},
			paint: {
				'text-color': MIST,
				// A dark halo in the land color, so a label crossing a coastline
				// stays legible without a box behind it.
				'text-halo-color': STONE,
				'text-halo-width': 1.1,
			},
		},
	],
};
