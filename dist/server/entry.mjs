import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Dj2fBdJW.mjs';
import { manifest } from './manifest_BjepX07l.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/characters/_id_.astro.mjs');
const _page2 = () => import('./pages/api/characters.astro.mjs');
const _page3 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.17.1_@types+node@20.19.27_jiti@2.6.1_lightningcss@1.30.2_rollup@4.57.1_typescript@5.9.3_yaml@2.8.2/node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/api/characters/[id].ts", _page1],
    ["src/pages/api/characters/index.ts", _page2],
    ["src/pages/index.astro", _page3]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/ezequ/Documents/Software%20Proyects/star-wars-holocron/dist/client/",
    "server": "file:///C:/Users/ezequ/Documents/Software%20Proyects/star-wars-holocron/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
