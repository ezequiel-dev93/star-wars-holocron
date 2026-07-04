import { G as GetCharacters } from '../../chunks/GetCharacters_BpzxAH7y.mjs';
import { c as characterRepository } from '../../chunks/SwapiCharacterRepository_Bgg8SXMx.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get("page") || "1");
    const getCharacters = new GetCharacters(characterRepository);
    const result = await getCharacters.execute(page);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching characters" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
