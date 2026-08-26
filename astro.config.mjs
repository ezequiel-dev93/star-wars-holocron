import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import starlight from '@astrojs/starlight';

export default defineConfig({
    output: 'server',
    adapter: vercel(),
    integrations: [
        react(),
        starlight({
            title: 'Star Wars Holocron',
            description: 'Documentación oficial de la API REST del universo Star Wars.',
            logo: {
                src: './public/images/logos/logo.png',
                alt: 'Star Wars Holocron',
            },
            social: [],
            sidebar: [
                {
                    label: 'Introducción',
                    items: [
                        { slug: 'introduccion' },
                        { slug: 'empezar' },
                    ],
                },
                {
                    label: 'Personajes',
                    items: [
                        { slug: 'personajes/listar' },
                        { slug: 'personajes/por-id' },
                    ],
                },
                {
                    label: 'Planetas 🔜',
                    items: [
                        { slug: 'planetas/listar' },
                    ],
                },
                {
                    label: 'Películas 🔜',
                    items: [
                        { slug: 'peliculas/listar' },
                    ],
                },
                {
                    label: 'Armas 🔜',
                    items: [
                        { slug: 'armas/listar' },
                    ],
                },
            ],
            customCss: ['./src/styles/starlight.css'],
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});