// 1. 지도 생성
var map = L.map('map', {
    center: [36.5, 127.8],
    zoom: 8,
    minZoom: 8,
    maxZoom: 13
});

// 2. 배경지도 (VWorld)
L.tileLayer('https://api.vworld.kr/req/wmts/1.0.0/3526DC75-E395-3B90-B026-E66AAC769E56/Base/{z}/{y}/{x}.png', {
    attribution: '&copy; VWorld',
    tileSize: 256,
    maxZoom: 19
}).addTo(map);

// 3. 줌레벨별 WMS 레이어 정의
var wmsZ1 = L.tileLayer.wms('http://localhost:8080/geoserver/jaewon/wms', {
    layers: 'jaewon:JAWON_SHP',
    styles: 'JAEWON_STYLE',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    tiled: true
});

var wmsZ2 = L.tileLayer.wms('http://localhost:8080/geoserver/jaewon/wms', {
    layers: 'jaewon:JAWON_SHP',
    styles: 'JAEWON_STYLE',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    tiled: true
});

var wmsZ3 = L.tileLayer.wms('http://localhost:8080/geoserver/jaewon/wms', {
    layers: 'jaewon:JAWON_SHP',
    styles: 'JAEWON_STYLE',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    tiled: true
});

// 4. 줌 이벤트에 따라 WMS 레이어 업데이트
function updateWMSLayer() {
    // 모두 제거 후
    map.removeLayer(wmsZ1);
    map.removeLayer(wmsZ2);
    map.removeLayer(wmsZ3);

    // 줌값에 따라 추가
    var zoom = map.getZoom();
    if (zoom >= 7 && zoom <= 9) {
        map.addLayer(wmsZ1);
    } else if (zoom >= 10 && zoom <= 11) {
        map.addLayer(wmsZ2);
    } else if (zoom >= 12 && zoom <= 13) {
        map.addLayer(wmsZ3);
    }
}

map.on('zoomend', updateWMSLayer);
updateWMSLayer(); // 초기화 시 호출


