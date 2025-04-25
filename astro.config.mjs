// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.simonctech.com',

    markdown: {
        shikiConfig: {
            theme: 'catppuccin-frappe',
        },
        syntaxHighlight: 'shiki',
        gfm: false, // GitHub Flavored Markdown
        smartypants: true // Better typography
    },

    vite: {
        plugins: [tailwindcss()]
    },

    integrations: [
        mdx(),
        svelte(),
        sitemap({
            // Optional: Customize for blog posts
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date(),
            // Filter out non-blog pages if needed
            filter: (page) => page.includes('/blog/'),
            i18n: {
                defaultLocale: 'es',
                locales: {
                    en: 'en-US',
                    es: 'es-ES',
                    fr: 'fr-CA',
                },
            },
        })
    ],

    adapter: vercel()
});
