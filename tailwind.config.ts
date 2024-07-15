import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    darkMode: 'selector',
    content: [
        "./index.html",
        "./src/**/*.{html,js,ts}"
    ],
    theme: {
        container: {
            center: true
        },
        extend: {
            colors: {
                primary: {
                    '50': '#fffaec',
                    '100': '#fff3d3',
                    '200': '#ffe4a5',
                    '300': '#ffce6d',
                    '400': '#ffae32',
                    '500': '#ff930a',
                    '600': '#ff7b00',
                    '700': '#cc5902',
                    '800': '#a1450b',
                    '900': '#823b0c',
                    '950': '#461b04',
                },
                gray: {
                    50: "#e0e0e0",
                    100: "#D1D1D1",
                    200: "#A3A3A3",
                    300: "#757575",
                    400: "#474747",
                    500: "#1B1B1B",
                    600: "#141414",
                    700: "#0F0F0F",
                    800: "#0A0A0A",
                    900: "#050505",
                    950: "#030303"
                },
                'woodsmoke': {
                    DEFAULT: '#161618',
                    50: '#585860',
                    100: '#54545C',
                    200: '#4D4D54',
                    300: '#46464C',
                    400: '#3E3E44',
                    500: '#37373C',
                    600: '#303034',
                    700: '#28282C',
                    800: '#212124',
                    900: '#1A1A1C',
                    950: '#161618'
                },
                // slate: {
                //     DEFAULT: "#687083",
                //     '50':  '#f9faf9',
                //     '100': '#eff1f4',
                //     '200': '#dadee8',
                //     '300': '#b3bccb',
                //     '400': '#8693a6',
                //     '500': '#687083',
                //     '600': '#535565',
                //     '700': '#3f404b',
                //     '800': '#2b2b34',
                //     '900': '#191a20',
                // },
                slate: {
                    '50': '#f7fafa', 
                    '100': '#e5e9ea', 
                    '200': '#dde8eb', 
                    '300': '#c8dade', 
                    '400': '#a5bfc7', 
                    '500': '#84a2ad', 
                    '600': '#6a8d9c', 
                    '700': '#4a6e82', 
                    '800': '#305169', 
                    '900': '#1b374f', 
                    '950': '#0b1e33'
                },
                blue: {
                    100: "#d2d8e8",
                    200: "#a5b0d0",
                    300: "#7889b9",
                    400: "#4b61a1",
                    500: "#1e3a8a",
                    600: "#182e6e",
                    700: "#122353",
                    800: "#0c1737",
                    900: "#060c1c"
                },
                danger: {
                    50: "#FFF1F2",
                    100: "#FFE4E6",
                    200: "#FECDD3",
                    300: "#FDA4AF",
                    400: "#FB7185",
                    500: "#F43F5E",
                    600: "#E11D48",
                    700: "#BE123C",
                    800: "#9F1239",
                    900: "#881337"
                },
                warning: {
                    50: "#FFFBEB",
                    100: "#FEF3C7",
                    200: "#FDE68A",
                    300: "#FCD34D",
                    400: "#FBBF24",
                    500: "#F59E0B",
                    600: "#D97706",
                    700: "#B45309",
                    800: "#92400E",
                    900: "#78350F"
                },
                success: {
                    50: "#F0FDF4",
                    100: "#DCFCE7",
                    200: "#BBF7D0",
                    300: "#86EFAC",
                    400: "#4ADE80",
                    500: "#22C55E",
                    600: "#16A34A",
                    700: "#166534",
                    800: "#14532D",
                    900: "#14532D"
                },
            },
            fontFamily: {
                'sans': ['"Plus Jakarta Sans Variable"', ...defaultTheme.fontFamily.sans]
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-links': theme('colors.primary[600]'),
                    }
                }
            })
        }
    },
    plugins: [
        require("@tailwindcss/typography"),
        plugin(({ addVariant }) => {
            addVariant('popper-show', '&[data-show=true]');
            addVariant('popper-hide', '&[data-show=false]');
        })
    ]
} as Config;