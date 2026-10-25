// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

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

    // Every page goes in the sitemap; the API route and search.json are not pages.
    integrations: [sitemap()],

    adapter: vercel()
});
