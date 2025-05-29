// 1. 마커용 pane 생성
map.createPane('incidentPane');
map.getPane('incidentPane').style.zIndex = 675;

// 2. 아이콘 정의
const incidentIcon = L.icon({
  iconUrl: '/static/images/ic_vms.png', // 아이콘 경로 적절히 수정
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// 3. 변수 선언
let incidentMarkers = [];
let incidentData = [];
let incidentVisible = false;

// 4. 지도 이벤트 등록
map.on('zoomend moveend', () => {
  if (incidentVisible) {
    updateIncidentMarkers();
  }
});

// 5. 버튼 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('toggle-vms');

  if (!btn) {
    console.error("❌ 사고다발 버튼이 존재하지 않아요.");
    return;
  }

  btn.addEventListener('click', () => {
    incidentVisible = !incidentVisible;

    if (incidentVisible) {
      console.log("📡 사고잦은구간 로딩 중...");
      if (incidentData.length === 0) {
        loadIncidentData();
        btn.classList.add("active");
      } else {
        updateIncidentMarkers();
      }
    } else {
      clearIncidentMarkers();
      btn.classList.remove("active");
    }
  });
});

// 6. 사고 데이터 불러오기
function loadIncidentData() {
  fetch('https://openapi.its.go.kr:9443/posIncidentInfo?apiKey=99cd52a4308346a985271bf668724e65&minX=124.5&maxX=132.0&minY=33.0&maxY=39.5&getType=json')
    .then(response => response.json())
    .then(data => {
      if (data.header.resultCode !== 0) {
        console.error("🚨 API 오류:", data.header.resultMsg);
        return;
      }
      incidentData = data.body.items;
      updateIncidentMarkers();
    })
    .catch(error => {
      console.error("❌ 사고 데이터 로딩 실패:", error);
    });
}

// 7. 마커 업데이트 함수
function updateIncidentMarkers() {
  clearIncidentMarkers();

  const bounds = map.getBounds();
  const zoom = map.getZoom();

  let limit = 0;
  if (zoom <= 9) limit = 20;
  else if (zoom <= 10) limit = 50;
  else if (zoom <= 11) limit = 150;
  else limit = 500;

  const filtered = incidentData.filter(item => {
    const lat = parseFloat(item.startY);
    const lng = parseFloat(item.startX);
    return item.priority === "1" && bounds.contains([lat, lng]); // ✅ 조건 추가
  });

  const sampled = getRandomSample(filtered, limit);

  sampled.forEach(item => {
    const lat = parseFloat(item.startY);
    const lng = parseFloat(item.startX);
    const msg = item.message || '사고 정보 없음';
    const type = item.outbrkType || '유형 정보 없음';

    const marker = L.marker([lat, lng], {
      icon: incidentIcon,
      pane: 'incidentPane'
    }).bindPopup(`
      <strong>🚨 ${type}</strong><br>
      <div style="font-size: 13px;">${msg}</div>
    `);

    marker.addTo(map);
    
    incidentMarkers.push(marker);
  });

  console.log(`✅ 사고 마커 ${sampled.length}건 표시됨`);
}

// 8. 마커 제거 함수
function clearIncidentMarkers() {
  incidentMarkers.forEach(marker => map.removeLayer(marker));
  incidentMarkers = [];
  
}

// 9. 랜덤 샘플링 함수
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
