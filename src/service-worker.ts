/// <reference types="@sveltejs/kit"/>
/// <reference lib="webworker"/>
declare let self: ServiceWorkerGlobalScope;
import { build, files, version } from "$service-worker";
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files]
self.addEventListener('install', event => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }
    event.waitUntil(addFilesToCache())
})

self.addEventListener('activate', event => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) {
                await caches.delete(key);
            }
        }
    }
    event.waitUntil(deleteOldCaches());
})


self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    async function respond() {

        const url = new URL(event.request.url)
        const cache = await caches.open(CACHE);
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(url.pathname)
            if (cachedResponse) {
                return cachedResponse;
            }
        }
        try {
            const response = await fetch(event.request);
            const isNotExtension = url.protocol === 'http:'
            const isSuccess = response.status === 200;
            if ((isNotExtension && isSuccess) || response.url === "https://miniweather-colon101.vercel.app/") {
                cache.put(event.request, response.clone())
            }
            return response;
        } catch {

            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: "IS_OFFLINE", "message": "You are offline" })
                })
            })

            const cachedResponse = await cache.match(url.pathname)
            if (cachedResponse) {
                return cachedResponse;
            }
        }
        return new Response('Not found', { status: 404 })
    }

    event.respondWith(respond())
})
self.addEventListener('message', event => {
    if (event.data && event.data.type === "SKIP_WAIT") {
        self.skipWaiting();
    }
})
