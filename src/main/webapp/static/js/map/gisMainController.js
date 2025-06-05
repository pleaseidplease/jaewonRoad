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


// WMS 레이어 정보 비동기 로딩
fetch('/api/geoserver/layer-info')
  .then(response => response.json())
  .then(data => {
    const baseUrl = `${data.url}/${data.workspace}/wms`;
    const layerOptions = {
      layers: `${data.workspace}:${data.layerName}`,
      styles: data.style,
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      tiled: true
    };

    // 줌별 레이어
    var wmsZ1 = L.tileLayer.wms(baseUrl, layerOptions);
    var wmsZ2 = L.tileLayer.wms(baseUrl, layerOptions);
    var wmsZ3 = L.tileLayer.wms(baseUrl, layerOptions);

    function updateWMSLayer() {
      map.removeLayer(wmsZ1);
      map.removeLayer(wmsZ2);
      map.removeLayer(wmsZ3);
      var zoom = map.getZoom();
      if (zoom >= 7 && zoom <= 9) map.addLayer(wmsZ1);
      else if (zoom >= 10 && zoom <= 11) map.addLayer(wmsZ2);
      else if (zoom >= 12 && zoom <= 13) map.addLayer(wmsZ3);
    }

    map.on('zoomend', updateWMSLayer);
    updateWMSLayer(); // 초기 실행
  });

