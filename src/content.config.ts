import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';


const chapters = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
	schema: z.object({
		title: z.string(),
		chapterNumber: z.number(),
		place: z.string(),
		accent: z.enum(['ube', 'yuzu', 'matcha']),
		botanicalName: z.string(),
		flavorDescription: z.string(),
		originFigure: z.object({
			src: z.string(),
			alt: z.string(),
			caption: z.string(),
		}),
		callouts: z.array(
			z.object({
				label: z.string(),
				body: z.string(),
			})
		),
		stats: z.array(
			z.object({
				value: z.string(),
				label: z.string(),
				source: z.string(),
			})
		),
		inTheGlass: z.string(),
		recipes: z.array(
			z.object({
				name: z.string(),
				slug: z.string(),
				alcoholic: z.boolean(),
			})
		),
	}),
});

const recipes = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
	schema: z.object({
		name: z.string(),
		slug: z.string(),
		tagline: z.string(),
		ingredient: z.enum(['ube', 'yuzu', 'matcha']),
		alcoholic: z.boolean(),
		glass: z.string(),
		build: z.array(
			z.object({
				amount: z.string(),
				item: z.string(),
			})
		),
		method: z.string(),
		garnish: z.string(),
		image: z.string(),
		expect: z.array(z.string()),
		balance: z.array(z.string()),
		tasting: z.array(z.string()),
		costEstimateCHF: z.string(),
	}),
});

const bars = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/bars' }),
	schema: z.object({
		name: z.string(),
		slug: z.string(),
		city: z.string(),
		country: z.string(),
		address: z.string(),
		// Geocoded from the published street address via OpenStreetMap
		// Nominatim. The map only plots entries where both are finite numbers.
		lat: z.number(),
		lng: z.number(),
		source: z.string(),
		rank: z.number().optional(),
		// Sourced description. Everything here traces to `source`.
		context: z.string(),
		// Simon's own comment, kept in a separate field so the cited
		// description above never gets blended with personal opinion.
		// Rendered under a "From the visit" label.
		note: z.string().optional(),
		// Optional: only present where the source names a specific drink.
		// Bars whose published entry names no single signature serve omit
		// this rather than carry an invented one.
		signatureCocktail: z
			.object({
				name: z.string(),
				description: z.string(),
			})
			.optional(),
		relatedIngredients: z.array(z.enum(['ube', 'yuzu', 'matcha'])).default([]),
		image: z
			.object({
				src: z.string(),
				alt: z.string(),
				caption: z.string(),
				credit: z.enum(['ai-generated', 'photographer']),
				attribution: z.string().optional(),
			})
			.optional(),
	}),
});

export const collections = { chapters, recipes, bars };
