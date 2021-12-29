/// <reference no-default-lib="true"/>
/// <reference lib="webworker"/>

const CACHE_NAME = 'my-site-cache-v1'
const urlsToCache = [
  '/EAMD.ucp/Kernel/BaseKernel.js',
  '/EAMD.ucp/Kernel/BrowserKernel.js',
  '/EAMD.ucp/Thinglish/Thinglish.js',
  '/EAMD.ucp/Thinglish/Once.js',
  '/Once.class.js',
  '/Once.html',
  'manifest.json'
]
export class ServiceWorkerKernel {
  private install (event:ExtendableEvent) {
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

  private fetch (event:FetchEvent) {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          console.log('service worker fetch')

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

  private activate (event:ExtendableEvent) {
    const cacheAllowlist = ['pages-cache-v1', 'blog-posts-cache-v1']
    console.log('service worker activate')

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

  // constructor () {
  //   super(self)
  // }

  addEventListener (obj:any) {
    obj.addEventListener('install', this.install)
    obj.addEventListener('fetch', this.fetch)
    obj.addEventListener('activate', this.activate)
  }

  async installServiceWorker (navigator:any) {
    console.log('service worker start method')
    // eslint-disable-next-line no-debugger
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/Once.class.js', { type: 'module', scope: '/' }).then(function (registration:any) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
        // document.body.innerText = 'ServiceWorker registration successful with scope: ' + registration.scope
      }, function (err:any) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
        // document.body.innerText = err
      })
    } else {
      console.log('no service worker found')
      // document.body.innerText = 'no service worker'
    }

  //   return this
  // }
  }
}
