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
            theme: 'gruvbox-dark-hard',
            transformers: [
                {
                    // Wrap each code block so the reader can put its language in the border (like a
                    // pane title) and a copy button, outside the block's horizontal scroll.
                    root(root) {
                        root.children = [
                            {
                                type: 'element',
                                tagName: 'div',
                                properties: { className: ['code-block'], dataLang: this.options.lang },
                                children: root.children,
                            },
                        ];
                    },
                },
            ],
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
