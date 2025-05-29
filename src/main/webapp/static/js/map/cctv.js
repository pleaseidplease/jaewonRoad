// 1. 마커용 pane 생성
map.createPane('cctvPane');
map.getPane('cctvPane').style.zIndex = 650;

// 2. CCTV 아이콘 정의
const cctvIcon = L.icon({
  iconUrl: '/static/images/ic_cctv.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

// 3. 변수 선언
let cctvMarkerMap = new Map();  // 중복 방지용 Map (key = cctvurl)
let cctvData = [];
let cctvVisible = false;

// 4. 지도 줌/이동 시 반응
map.on('zoomend moveend', () => {
  if (cctvVisible) {
    updateCctvMarkers();
  }
});

// 5. 버튼 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('toggle-cctv');
  

  if (!btn) {
    console.error("❌ CCTV 버튼이 존재하지 않아요.");
    return;
  }

  btn.addEventListener('click', () => {
    cctvVisible = !cctvVisible;

    if (cctvVisible) {
      console.log("📡 CCTV 로딩 중...");
      if (cctvData.length === 0) {
        loadCctvData();
        btn.classList.add("active"); 
      } else {
        updateCctvMarkers();
      }
      
    } else {
      clearCctvMarkers()
      btn.classList.remove("active");
	}
  });
});

// 6. CCTV 데이터 로딩
function loadCctvData() {
  fetch("https://openapi.its.go.kr:9443/cctvInfo?apiKey=99cd52a4308346a985271bf668724e65&type=ex&cctvType=1&minX=124.5&maxX=132.0&minY=33.0&maxY=39.5&getType=json")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
      return res.json();
    })
    .then(json => {
      cctvData = json.response?.data || [];
      console.log(`✅ CCTV ${cctvData.length}개 로딩 완료`);
      updateCctvMarkers();
    })
    .catch(err => {
      console.error("❌ CCTV API 오류:", err);
      alert("CCTV 데이터를 불러오는 데 실패했습니다.");
    });
}

// 7. 마커 표시 (기존 유지 + 부족분 추가만)
function updateCctvMarkers() {
  const bounds = map.getBounds();
  const zoom = map.getZoom();

  let limit = 0;
  if (zoom <= 9) limit = 20;
  else if (zoom <= 10) limit = 50;
  else if (zoom <= 11) limit = 150;
  else limit = 500;

  const visibleCctvs = cctvData.filter(cctv => {
    const lat = parseFloat(cctv.coordy);
    const lng = parseFloat(cctv.coordx);
    return cctv.cctvformat === 'HLS' && cctv.cctvurl && bounds.contains([lat, lng]);
  });

  const sampled = getRandomSample(visibleCctvs, limit);

  // 👉 현재 열려 있는 팝업이 연결된 마커 (있으면)
  const openedPopup = map._popup;
  let protectedUrl = null;

  if (openedPopup && openedPopup._source) {
    // 해당 마커가 Map에 등록된 CCTV 중 하나라면 보호
    for (const [url, marker] of cctvMarkerMap.entries()) {
      if (marker === openedPopup._source) {
        protectedUrl = url;
        break;
      }
    }
  }

  // ✅ 화면에 없는 마커 제거하되, 현재 열린 마커는 보호
  for (const [url, marker] of cctvMarkerMap.entries()) {
    const match = sampled.find(c => c.cctvurl === url);
    if (!match && url !== protectedUrl) {
      map.removeLayer(marker);
      cctvMarkerMap.delete(url);
    }
  }

  // 🆕 새 마커 추가
  sampled.forEach((cctv, index) => {
    if (cctvMarkerMap.has(cctv.cctvurl)) return;

    const lat = parseFloat(cctv.coordy);
    const lng = parseFloat(cctv.coordx);
    const videoId = `video-${index}-${Date.now()}`;

    const marker = L.marker([lat, lng], {
      icon: cctvIcon,
      pane: 'cctvPane'
    });

    marker.bindPopup(`
      <strong>${cctv.cctvname}</strong><br/>
      <video id="${videoId}" width="300" height="200" controls autoplay muted></video>
    `);

    marker.bindTooltip(cctv.cctvname, {
      direction: 'top',
      offset: [0, -10],
      sticky: true
    });

    marker.on('popupopen', () => {
      const video = document.getElementById(videoId);
      if (!video) return;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(cctv.cctvurl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = cctv.cctvurl;
      }
    });
	
    marker.addTo(map);
    cctvMarkerMap.set(cctv.cctvurl, marker);
  });

  console.log(`✅ CCTV ${cctvMarkerMap.size}건 표시 (보호 마커: ${protectedUrl ?? "없음"})`);
}


// 8. 마커 제거 (전체 숨기기 시 사용)
function clearCctvMarkers() {
  for (const marker of cctvMarkerMap.values()) {
    map.removeLayer(marker);
  }
  cctvMarkerMap.clear();
  
  console.log("🧹 CCTV 마커 전체 제거 완료");
}

// 9. 랜덤 샘플링
function getRandomSample(array, count) {
  const result = [];
  const taken = new Set();

  while (result.length < count && result.length < array.length) {
    const idx = Math.floor(Math.random() * array.length);
    if (!taken.has(idx)) {
      taken.add(idx);
      result.push(array[idx]);
    }
  }

  return result;
}
