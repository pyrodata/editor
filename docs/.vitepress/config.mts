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
                    { text: 'Code highlighting', link: '/advanced-usage/code-highlighting' },
                ],
            },
            {
                
                text: 'Interfaces',
                items: [
                    { text: 'Config', link: '/interfaces/config' },
                    { text: 'PdButton', link: '/interfaces/pd-button' },
                    { text: 'PdDropdown', link: '/interfaces/pd-dropdown' },
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
