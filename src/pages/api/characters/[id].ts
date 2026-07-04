import type { APIRoute } from 'astro';
import { getCharacterByIdUseCase as getCharacterById } from '@/config/dependencies';

/**
 * GET /api/characters/[id]
 * Obtiene un personaje por su ID
 */
export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Character ID is required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const character = await getCharacterById.execute(id);

        if (!character) {
            return new Response(
                JSON.stringify({ error: 'Character not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        return new Response(JSON.stringify(character), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching character:', error);

        return new Response(
            JSON.stringify({ error: 'Error fetching character' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
