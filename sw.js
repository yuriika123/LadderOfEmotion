// キャッシュの名前とバージョン
const CACHE_NAME = 'emotion-ladder-v1.1';
const STATIC_CACHE = 'emotion-ladder-static-v1.1';
const DYNAMIC_CACHE = 'emotion-ladder-dynamic-v1.1';

// キャッシュする静的ファイル
const STATIC_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/manifest.json'
];

// キャッシュする外部リソース
const EXTERNAL_FILES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// インストールイベント
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // 静的ファイルをキャッシュ
            caches.open(STATIC_CACHE).then(function(cache) {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            }),
            // 外部リソースをキャッシュ
            caches.open(DYNAMIC_CACHE).then(function(cache) {
                console.log('Service Worker: Caching external resources');
                return cache.addAll(EXTERNAL_FILES);
            })
        ])
    );
    
    // 新しいサービスワーカーを即座にアクティブにする
    self.skipWaiting();
});

// アクティベートイベント
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // 古いキャッシュを削除
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // 制御下のページを即座に制御する
    self.clients.claim();
});

// フェッチイベント
self.addEventListener('fetch', function(event) {
    const { request } = event;
    const url = new URL(request.url);
    
    // 同じオリジンのリクエストのみを処理
    if (url.origin !== location.origin) {
        return;
    }
    
    // HTMLページのリクエスト
    if (request.destination === 'document') {
        event.respondWith(
            caches.match(request)
                .then(function(response) {
                    if (response) {
                        // キャッシュから返す
                        return response;
                    }
                    
                    // ネットワークから取得
                    return fetch(request)
                        .then(function(response) {
                            // 成功した場合のみキャッシュに保存
                            if (response && response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(STATIC_CACHE).then(function(cache) {
                                    cache.put(request, responseClone);
                                });
                            }
                            return response;
                        })
                        .catch(function() {
                            // オフライン時のフォールバック
                            return caches.match('/index.html');
                        });
                })
        );
        return;
    }
    
    // CSS、JS、画像などの静的リソース
    if (request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'image') {
        event.respondWith(
            caches.match(request)
                .then(function(response) {
                    if (response) {
                        return response;
                    }
                    
                    return fetch(request)
                        .then(function(response) {
                            if (response && response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(STATIC_CACHE).then(function(cache) {
                                    cache.put(request, responseClone);
                                });
                            }
                            return response;
                        });
                })
        );
        return;
    }
    
    // その他のリクエスト（APIなど）
    event.respondWith(
        fetch(request)
            .catch(function() {
                // ネットワークエラーの場合、キャッシュを確認
                return caches.match(request);
            })
    );
});

// バックグラウンド同期（オフライン時のデータ同期）
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

// プッシュ通知
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: '記録を見る',
                    icon: '/icon-192.png'
                },
                {
                    action: 'close',
                    title: '閉じる',
                    icon: '/icon-192.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// 通知クリック
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// バックグラウンド同期の実装
function doBackgroundSync() {
    // オフライン時に保存されたデータを同期
    return new Promise(function(resolve) {
        // ここでオフライン時のデータ同期処理を実装
        console.log('Service Worker: Background sync completed');
        resolve();
    });
}

// エラーハンドリング
self.addEventListener('error', function(event) {
    console.error('Service Worker Error:', event.error);
});

// 未処理のPromise拒否
self.addEventListener('unhandledrejection', function(event) {
    console.error('Service Worker Unhandled Rejection:', event.reason);
}); 