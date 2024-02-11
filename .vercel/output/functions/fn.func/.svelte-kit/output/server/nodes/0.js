

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.dqdf0X5r.js","_app/immutable/chunks/scheduler.f67yK1Oq.js","_app/immutable/chunks/index.sFsF6rgK.js"];
export const stylesheets = ["_app/immutable/assets/0.FnHMBM58.css"];
export const fonts = [];
