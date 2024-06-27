import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        container: {
            center: true
        },
        extend: {
            colors: {
                primary: {
                    100: "#cedaeb",
                    200: "#9db4d7",
                    300: "#6c8fc3",
                    400: "#3b69af",
                    500: "#0a449b",
                    600: "#08367c",
                    700: "#06295d",
                    800: "#041b3e",
                    900: "#020e1f"
                },
            }
        }
    },

    plugins: [require("@tailwindcss/typography")]
} as Config;