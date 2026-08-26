import type { APIRoute } from 'astro';
import { getCharactersUseCase as getCharacters } from '@/config/dependencies';

/**
 - GET /api/characters
 - Obtiene lista paginada de personajes
*/
export const GET: APIRoute = async ({ url }) => {
    try {
        const page = Number(url.searchParams.get('page') || '1');

        const result = await getCharacters.execute(page);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching characters:', error);

        return new Response(
            JSON.stringify({ error: 'Error fetching characters' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};