// 🚨 지도 로드되자마자 사고 표시
window.addEventListener("load", () => {
  document.getElementById("toggle-accident").click();
});

// 1. 사고 마커용 pane 생성 (WMTS보다 위로)
map.createPane('accidentPane');
map.getPane('accidentPane').style.zIndex = 660;

// 2. 사고 마커 아이콘 정의
const accidentIcon = L.icon({
  iconUrl: '/static/images/ic_accident.png', // 생성한 사고 아이콘
  iconSize: [40, 40],       // 🚩 크기 키움 (기존 30 → 48)
  iconAnchor: [20, 40],     // 중심 좌표 맞춤 (정중앙 아래)
  popupAnchor: [0, -40]     // 팝업 위치 위로 조정
});

// 3. 변수 선언
let accidentMarkers = [];
let accidentVisible = false;

// 4. 사고 버튼 이벤트 등록
document.getElementById("toggle-accident").addEventListener("click", function () {
  const btn = this;

  if (!accidentVisible) {
    // 🚧 마커 추가
    fetch("https://openapi.its.go.kr:9443/eventInfo?apiKey=99cd52a4308346a985271bf668724e65&type=ex&eventType=acc&minX=124.5&maxX=132.0&minY=33.0&maxY=39.5&getType=json")
      .then(res => res.json())
      .then(json => {
        const accidents = json.body?.items || [];

        accidents.forEach((acc, i) => {
          const lat = parseFloat(acc.coordY);
          const lng = parseFloat(acc.coordX);
          if (!lat || !lng) return;

          const marker = L.marker([lat, lng], {
            icon: accidentIcon,
            pane: 'accidentPane'
          });

          const popupHtml = `
            <strong>${acc.eventType || '사고'}</strong><br/>
            도로명: ${acc.roadName || '-'}<br/>
            방향: ${acc.roadDrcType || '-'}<br/>
            차단 차로: ${acc.lanesBlocked || '정보 없음'}<br/>
            내용: ${acc.message || '-'}<br/>
            발생시간: ${formatDate(acc.startDate)}
          `;

          marker.bindPopup(popupHtml);
          marker.bindTooltip(`${acc.eventType}: ${acc.message}`, {
            direction: 'top',
            offset: [0, -10],
            sticky: true
          });

          marker.addTo(map);
          accidentMarkers.push(marker);
        });

        accidentVisible = true;
        btn.textContent = "사고 숨기기";  
        btn.classList.add("active");      
        console.log(`🚧 사고 ${accidentMarkers.length}건 표시됨`);
      })
      .catch(err => {
        console.error("❌ 사고 정보 불러오기 실패", err);
        alert("사고 정보를 불러올 수 없습니다.");
      });

  } else {
    // 🧹 마커 제거
    accidentMarkers.forEach(marker => map.removeLayer(marker));
    accidentMarkers = [];
    accidentVisible = false;
    btn.textContent = "사고 보기";
    btn.classList.remove("active");
    console.log("🚧 사고 마커 제거됨");
  }
});

// 5. 날짜 포맷 함수
function formatDate(str) {
  if (!str || str.length < 12) return '-';
  return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)} ${str.slice(8, 10)}:${str.slice(10, 12)}`;
}
