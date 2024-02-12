/// <reference types="@sveltejs/kit"/>
/// <reference lib="webworker"/>
declare let self: ServiceWorkerGlobalScope;
import { build, files, version } from "$service-worker";

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', event => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }
    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', event => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) {
                await caches.delete(key);
            }
        }
    }
    event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // Always serve "/" from cache
        if (url.pathname === '/' || url.pathname === '/index.html') {
            const cachedResponse = await cache.match('/');
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        // For other requests, attempt to fetch from network
        try {
            const response = await fetch(event.request);
            // Cache the response if it's a successful GET request
            if (response.status === 200 && event.request.method === 'GET') {
                cache.put(event.request, response.clone());
            }
            return response;
        } catch {
            // If fetching from network fails, serve from cache
            const cachedResponse = await cache.match('/');
            if (cachedResponse) {
                return cachedResponse;
            }
            // If not found in cache, return a 404 response
            return new Response('Not found', { status: 404 });
        }
    }

    event.respondWith(respond());
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === "SKIP_WAIT") {
        self.skipWaiting();
    }
});
