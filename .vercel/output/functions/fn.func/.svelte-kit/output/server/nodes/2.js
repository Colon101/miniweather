import * as universal from '../entries/pages/_page.ts.js';
import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.cVR7NPua.js","_app/immutable/chunks/scheduler.f67yK1Oq.js","_app/immutable/chunks/index.sFsF6rgK.js","_app/immutable/chunks/index.N1tTquTY.js"];
export const stylesheets = [];
export const fonts = [];
