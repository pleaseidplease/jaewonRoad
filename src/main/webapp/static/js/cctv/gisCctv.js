// 1. CCTV 마커용 pane 생성 (WMTS보다 위로)
map.createPane('cctvPane');
map.getPane('cctvPane').style.zIndex = 650;

// 2. 변수 및 아이콘 정의
let cctvCluster = null;
let cctvVisible = false;

const cctvIcon = L.icon({
  iconUrl: '/static/images/ic_cctv.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

document.getElementById("toggle-cctv").addEventListener("click", function () {
  const btn = this;

  if (!cctvVisible) {
    console.log("📡 CCTV 마커 로딩 시작...");

    fetch("https://openapi.its.go.kr:9443/cctvInfo?apiKey=99cd52a4308346a985271bf668724e65&type=ex&cctvType=1&minX=124.5&maxX=132.0&minY=33.0&maxY=39.5&getType=json")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
        return res.json();
      })
      .then(json => {
        const cctvs = json.response?.data || [];
        console.log(`✅ CCTV ${cctvs.length}개 받아옴`);

        if (cctvs.length === 0) {
          alert("표시할 CCTV가 없습니다.");
          return;
        }

        // 4. 클러스터 그룹 생성
        cctvCluster = L.markerClusterGroup({
          maxClusterRadius: 60,
          showCoverageOnHover: false,
          pane: 'cctvPane',
          iconCreateFunction: function (cluster) {
            return L.divIcon({
              html: `<div class="custom-cluster-icon"></div>`,
              className: 'cctv-cluster-icon',
              iconSize: [28, 28]
            });
          }
        });

        // 5. 마커 생성 및 클러스터에 추가
        cctvs.forEach((cctv, index) => {
          if (cctv.cctvformat === 'HLS' && cctv.cctvurl) {
            const videoId = `video-${index}-${Date.now()}`;

            const marker = L.marker([cctv.coordy, cctv.coordx], {
              icon: cctvIcon,
              pane: 'cctvPane'
            });

            // ▶ 팝업 영상
            marker.bindPopup(`
              <strong>${cctv.cctvname}</strong><br/>
              <video id="${videoId}" width="300" height="200" controls autoplay muted></video>
            `);

            // ▶ 툴팁: 마커에 마우스 올리면 이름 보임
            marker.bindTooltip(cctv.cctvname, {
              direction: 'top',
              offset: [0, -10],
              sticky: true
            });

            // ▶ 팝업 열릴 때 HLS 연결
            marker.on('popupopen', function () {
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

            cctvCluster.addLayer(marker);
          }
        });

        // 6. 지도에 클러스터 그룹 추가
        map.addLayer(cctvCluster);
        cctvVisible = true;
        btn.textContent = "CCTV 숨기기";
      })
      .catch(err => {
        console.error("❌ CCTV 불러오기 실패:", err);
        alert("CCTV API 호출에 실패했습니다. 콘솔을 확인해주세요.");
      });

  } else {
    console.log("🧹 CCTV 마커 제거");
    if (cctvCluster) {
      map.removeLayer(cctvCluster);
      cctvCluster = null;
    }
    cctvVisible = false;
    btn.textContent = "CCTV 보기";
  }
});
