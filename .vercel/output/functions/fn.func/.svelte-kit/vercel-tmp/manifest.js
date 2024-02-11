export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["apple-touch-icon-180x180.png","favicon.ico","logo.svg","manifest.json","maskable-icon-512x512.png","pwa-192x192.png","pwa-512x512.png","pwa-64x64.png","service-worker.js"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.aupQ5bKx.js","app":"_app/immutable/entry/app.oSZ-hSDb.js","imports":["_app/immutable/entry/start.aupQ5bKx.js","_app/immutable/chunks/entry.IdK_zYta.js","_app/immutable/chunks/scheduler.f67yK1Oq.js","_app/immutable/chunks/index.N1tTquTY.js","_app/immutable/entry/app.oSZ-hSDb.js","_app/immutable/chunks/scheduler.f67yK1Oq.js","_app/immutable/chunks/index.sFsF6rgK.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
