import { BaseKernel } from './EAMD.ucp/BaseKernel.js'

const CACHE_NAME = 'my-site-cache-v1'
const urlsToCache = [
  '/EAMD.ucp/BaseKernel.js',
  '/EAMD.ucp/BrowserKernel.js',
  '/EAMD.ucp/Once.class.js',
  '/Once.html',
  '/EAMD.ucp/Thinglish.js',
  '/ServiceWorkerKernel.js'
]

export class ServiceWorkerKernel extends BaseKernel {
  static install (event:any) {
    console.log('service worker is getting installed')
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          console.log('running in serviceworker')
          console.log('Opened cache')
          return cache.addAll(urlsToCache)
        })
    )
  }

  static fetch (event:any) {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          // Cache hit - return response
          if (response) {
            return response
          }

          return fetch(event.request).then(
            function (response) {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response
              }

              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              const responseToCache = response.clone()

              caches.open(CACHE_NAME)
                .then(function (cache) {
                  cache.put(event.request, responseToCache)
                })

              return response
            }
          )
        })
    )
  }

  static activate (event:any) {
    const cacheAllowlist = ['pages-cache-v1', 'blog-posts-cache-v1']

    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          // @ts-ignore
          // eslint-disable-next-line array-callback-return
          cacheNames.map(function (cacheName) {
            if (cacheAllowlist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
    )
  }

  constructor () {
    super(self)
  }

  async start () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ServiceWorkerKernel.js', { type: 'module', scope: '/' }).then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
        document.body.innerText = 'ServiceWorker registration successful with scope: ' + registration.scope
      }, function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
        document.body.innerText = err
      })
    } else {
      document.body.innerText = 'no service worker'
    }

    return this
  }
}

self.addEventListener('install', ServiceWorkerKernel.install)
self.addEventListener('fetch', ServiceWorkerKernel.fetch)
self.addEventListener('activate', ServiceWorkerKernel.activate)
