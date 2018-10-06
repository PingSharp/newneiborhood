

let CACHE_NAME = 'neiborhoodmap-app-cache';
// Delete old caches
self.addEventListener('activate', event => {
  const currentCachelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!currentCachelist.includes(key)) {
            return caches.delete(key);
          }
        }))
      )
  );
});
// This triggers when user starts the app
self.addEventListener('install', function(event) {
  
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(function(cache) {
            
                // We will cache initial page 
                // We could also cache assets like CSS and images
                const urlsToCache = [
                  '/',
                 'App.css',
                 'App.js',
                 'index.js',
                 'ListView.js',
                 'Map.js',
                ];
                cache.addAll(urlsToCache);
              
          })
      );
    
  });
// Here we intercept request and serve up the matching files
self.addEventListener('fetch', function(event) {
   const src =event.request.url;
  if(src.startsWith("https:")){
    // event.request.mode = 'no-cors';
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const Url = PROXY_URL+src;
    event.request.url = Url;
    event.respondWith(caches.match(event.request).then(function(response){
      return response || fetch(event.request).then(function(resp){
        caches.open(CACHE_NAME).then(function(cache){
          cache.add(Url);
        }).catch((error)=>console.log(error));
        return resp;
      }).catch(function(error){
        console.log(error);
      })
    }
     ))
  } 
  else{
    event.respondWith(
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request).then(function (resp) {
            caches.open(CACHE_NAME).then(function (cache) {
              cache.add(event.request.url);
            }).catch((error)=>console.log(error));
            return resp;
          });
        })
      );}
    
});  