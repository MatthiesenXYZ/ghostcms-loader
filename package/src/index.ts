import { defineCollection } from 'astro:content';
import { loadEnv } from 'vite';
import { GhostCMSContentAPIFactory } from './api.js';
import {
	AuthorsLoader,
	PageLoader,
	PostsLoader,
	SettingsLoader,
	TagsLoader,
	TiersLoader,
} from './loaders/index.js';
import {
	authorsSchema,
	loaderSettingsSchema,
	pagesSchema,
	postsSchema,
	tagsSchema,
	tiersSchema,
} from './schemas/index.js';
import type { LoaderCollection, LoaderCollectionOpts } from './types.js';
import { logger } from './utils.js';

export function GhostCMSLoaderCollection({
	ghostUrl,
	apiVersion = 'v5.0',
	__DO_NOT_USE_TESTING_ONLY__GHOST_CONTENT_API_KEY = '',
}: LoaderCollectionOpts): LoaderCollection {
	const env = loadEnv('all', process.cwd(), 'GHOST_');
	const key = env.GHOST_CONTENT_API_KEY || __DO_NOT_USE_TESTING_ONLY__GHOST_CONTENT_API_KEY;

	if (!key || key === '') {
		logger.error('GHOST_CONTENT_API_KEY is required in your .env file to use this loader');
	}

	const api = GhostCMSContentAPIFactory(ghostUrl, key, apiVersion);

	return {
		ghostAuthors: defineCollection({
			schema: authorsSchema,
			loader: AuthorsLoader(api),
		}),
		ghostPages: defineCollection({
			schema: pagesSchema,
			loader: PageLoader(api),
		}),
		ghostPosts: defineCollection({
			schema: postsSchema,
			loader: PostsLoader(api),
		}),
		ghostSettings: defineCollection({
			schema: loaderSettingsSchema,
			loader: SettingsLoader(api),
		}),
		ghostTags: defineCollection({
			schema: tagsSchema,
			loader: TagsLoader(api),
		}),
		ghostTiers: defineCollection({
			schema: tiersSchema,
			loader: TiersLoader(api),
		}),
	};
}
