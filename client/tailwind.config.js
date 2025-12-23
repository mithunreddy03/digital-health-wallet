/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                primary: '#10b981', // Emerald 500
                primaryDark: '#059669', // Emerald 600
                secondary: '#0f766e', // Teal 700
                accent: '#f43f5e', // Rose 500
                dark: '#0f172a', // Slate 900
                surface: '#ffffff',
                background: '#f8fafc', // Slate 50
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            }
        },
    },
    plugins: [],
}
