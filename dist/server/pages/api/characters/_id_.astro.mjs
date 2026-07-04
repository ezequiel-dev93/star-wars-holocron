import { t as toCharacterDTO, c as characterRepository } from '../../../chunks/SwapiCharacterRepository_Bgg8SXMx.mjs';
export { renderers } from '../../../renderers.mjs';

class GetCharacterById {
  constructor(characterRepository) {
    this.characterRepository = characterRepository;
  }
  async execute(id) {
    const character = await this.characterRepository.findById(id);
    if (!character) {
      return null;
    }
    return toCharacterDTO(character);
  }
}

const GET = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Character ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const getCharacterById = new GetCharacterById(characterRepository);
    const character = await getCharacterById.execute(id);
    if (!character) {
      return new Response(
        JSON.stringify({ error: "Character not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(JSON.stringify(character), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching character:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching character" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
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
