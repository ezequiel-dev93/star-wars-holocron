import { e as createComponent, g as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, h as createAstro, m as maybeRenderHead, n as renderComponent } from '../chunks/astro/server_CTHI9CnM.mjs';
import 'clsx';
/* empty css                                 */
import { G as GetCharacters } from '../chunks/GetCharacters_BpzxAH7y.mjs';
import { c as characterRepository } from '../chunks/SwapiCharacterRepository_Bgg8SXMx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Star Wars Holocron",
    description = "Cat\xE1logo interactivo del universo Star Wars"
  } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><link rel="icon" type="image/png" href="images/logos/logo.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body class="antialiased bg-slate-950 text-slate-100 font-outfit min-h-screen"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/ezequ/Documents/Software Proyects/star-wars-holocron/src/layouts/Layout.astro", void 0);

const $$Astro$1 = createAstro();
const $$CharacterCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$CharacterCard;
  const { character } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/10"> <!-- Imagen --> <picture class="aspect-[3/4] overflow-hidden bg-slate-900"> <img${addAttribute(character.imageUrl, "src")}${addAttribute(character.name, "alt")} class="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" loading="lazy"> </picture> <!-- Info --> <article class="p-4"> <h2 class="text-lg font-semibold text-slate-100 group-hover:text-amber-400 transition-colors"> ${character.name} </h2> <div class="mt-2 flex flex-wrap gap-2 text-xs text-slate-400"> ${character.birthYear !== "unknown" && renderTemplate`<span class="px-2 py-1 bg-slate-700/50 rounded"> ${character.birthYear} </span>`} <span class="px-2 py-1 bg-slate-700/50 rounded capitalize"> ${character.gender} </span> </div> </article> <!-- Hover overlay --> <div class="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div> </section>`;
}, "C:/Users/ezequ/Documents/Software Proyects/star-wars-holocron/src/presentation/components/characters/CharacterCard.astro", void 0);

const $$Astro = createAstro();
const $$CharacterGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CharacterGrid;
  const { characters } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"> ${characters.map((character) => renderTemplate`${renderComponent($$result, "CharacterCard", $$CharacterCard, { "character": character })}`)} </div>`;
}, "C:/Users/ezequ/Documents/Software Proyects/star-wars-holocron/src/presentation/components/characters/CharacterGrid.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const getCharacters = new GetCharacters(characterRepository);
  const { characters, total, page, totalPages } = await getCharacters.execute(1);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Star Wars Holocron | Personajes" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen py-12 px-4"> <div class="max-w-7xl mx-auto"> <!-- Header --> <header class="text-center mb-12"> <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-4">
Star Wars Holocron
</h1> <p class="text-xl text-slate-400"> ${total} personajes en la galaxia
</p> </header> <!-- Grid de Personajes --> <!-- Grid de Personajes --> ${renderComponent($$result2, "CharacterGrid", $$CharacterGrid, { "characters": characters })} <!-- Pagination Info --> <div class="mt-12 text-center text-slate-400"> <p>Página ${page} de ${totalPages}</p> </div> </div> </main> ` })}`;
}, "C:/Users/ezequ/Documents/Software Proyects/star-wars-holocron/src/pages/index.astro", void 0);

const $$file = "C:/Users/ezequ/Documents/Software Proyects/star-wars-holocron/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
