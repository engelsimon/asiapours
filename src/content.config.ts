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

export const collections = { chapters, recipes };
