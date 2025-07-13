// 保存するキャッシュの名前
const CACHE_NAME = 'my-pwa-cache-v1';

// キャッシュするファイルのリスト
const FILES_TO_CACHE = [
    '/',
    '/index.html'
];

// サービスワーカーのインストールイベント
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('キャッシュを開きました');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// fetchイベント（リクエストがあるたびに発生）
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // キャッシュにリクエストがある場合はそれを返す
                if (response) {
                    return response;
                }
                // キャッシュにない場合はネットワークから取得
                return fetch(event.request);
            })
    );
}); 