import type { APIRoute } from "astro";
import { getCharactersUseCase } from "@core/characters";

/**
 * GET /api/characters
 * Obtiene lista paginada o filtrada de personajes a través del Caso de Uso GetCharacters.
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      Math.min(100, Number(url.searchParams.get("limit") || "24"))
    );
    const query = (url.searchParams.get("q") || "").trim();
    const species = (url.searchParams.get("species") || "").trim();
    const planet = (url.searchParams.get("planet") || "").trim();
    const gender = (url.searchParams.get("gender") || "").trim();
    const missingImage = url.searchParams.get("missing") === "1";

    const result = await getCharactersUseCase.execute({
      query,
      species,
      planet,
      gender,
      missingImage,
      page,
      pageSize: limit,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching characters:", error);

    return new Response(
      JSON.stringify({ error: "Error fetching characters" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
