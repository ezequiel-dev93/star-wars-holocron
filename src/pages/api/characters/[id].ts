import type { APIRoute } from "astro";
import { getCharacterByIdUseCase } from "@core/characters";

/**
 * GET /api/characters/[id]
 * Obtiene un personaje por su ID numérico, slug o nombre.
 */
export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Character ID or slug is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const character = await getCharacterByIdUseCase.execute(id);

    if (!character) {
      return new Response(JSON.stringify({ error: "Character not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify(character), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching character:", error);

    return new Response(
      JSON.stringify({ error: "Error fetching character" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
