import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: '/editor/',
    title: "Pyrodata RichText Editor",
    description: "Easily extensible RichText editor",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Examples', link: '/markdown-examples' }
        ],
        sidebar: [
            {
                text: 'Advanced usage',
                items: [
                    { text: 'Create a custom button', link: '/advanced-usage/create-a-custom-button' },
                ],
            },
            {
                
                text: 'Interfaces',
                items: [
                    { text: 'Config', link: '/interfaces/config' },
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
