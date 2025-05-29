<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>교통지도 메인</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- 스타일 시트 -->
	<link rel="stylesheet" href="/static/css/style.css">
	<link rel="stylesheet" href="/static/css/marker.css">
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
	<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
	<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
	
	<!-- 스크립트: 반드시 순서 지켜야 함 -->
	<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
	<script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
	

    
</head>

<body>

<header>
    <div class="logo">
	  <a href="/">
	    <img id="logo" src="/static/images/title_logo.png" alt="JAEWON TRAFFIC 로고" />
	    <img  src="/static/images/JaewonGPT.png"  style="height: 86px;"/>
	  </a>
	</div>
    <nav class="nav">
        <a href="#">교통지도</a>
        <a href="#">노선검색</a>
        <a href="#">사고정보</a>
        <a href="#">CCTV</a>
    </nav>
</header>

<div class="container">
<aside class="sidebar">
  <h3>📡 실시간 교통정보</h3>

  <div class="sidebar-buttons">
    <button onclick="togglePanel('search')">🚗 노선 검색</button>
    <button onclick="togglePanel('traffic')">🛣 주요 교통상황</button>
    <button onclick="togglePanel('incident')">🚧 사고/공사 알림</button>
    <button onclick="togglePanel('notice')">📢 공지사항</button>
  </div>
</aside>

<div class="side-detail" id="sideDetail">
  <div class="panel" id="searchPanel">
    <h4>🚗 노선 검색</h4>
    <input type="text" placeholder="노선명 또는 번호 입력" />
    <button onclick="searchRoute()">검색</button>
    <ul id="searchResult"></ul>
  </div>
  <div class="panel" id="trafficPanel">
    <h4>🛣 주요 교통상황</h4>
    <ul>
      <li>경부선: 정체 (서평택IC 부근)</li>
      <li>중부선: 사고 (여주JCT)</li>
    </ul>
  </div>
  <div class="panel" id="incidentPanel">
    <h4>🚧 사고/공사 알림</h4>
    <ul>
      <li>서해대교 야간 공사 중</li>
      <li>중앙고속도로 낙석 주의</li>
    </ul>
  </div>
  <div class="panel" id="noticePanel">
    <h4>📢 공지사항</h4>
    <ul>
      <li>5/18(토) 02:00~ 시스템 점검 안내</li>
      <li>야간 작업 구간 주의</li>
    </ul>
  </div>
</div>
	




    <main class="map-area">
    	<!-- 지도 위에 띄울 버튼 그룹 -->
		<div id="map-buttons" class="leaflet-top leaflet-right">
		  <div class="button-box">
		    <button id="toggle-accident" class="map-button">
		      <img src="/static/images/ic_accident.png" alt="사고" />
		      <span class="btn-label">사고</span>
		    </button>
		    <button id="toggle-cctv" class="map-button">
		      <img src="/static/images/ic_cctv.png" alt="CCTV" />
		      <span class="btn-label">CCTV</span>
		    </button>
		    <button id="toggle-vms" class="map-button">
		      <img src="/static/images/ic_vms.png" alt="VMS" />
		      <span class="btn-label">도로전광표지</span>
		    </button>
		  </div>
		</div>


   	  	<div class="traffic-status">
            <div class="status green">원활 (80km/h 이상)</div>
            <div class="status orange">서행 (40~80km/h)</div>
            <div class="status red">정체 (40km/h 미만)</div>
        </div>
        <div id="map"></div>
  		
    </main>
</div>

<script src="/static/js/map/gisMainController.js"></script>
<script src="/static/js/map/cctv.js"></script>
<script src="/static/js/map/accident.js"></script>
<script src="/static/js/map/vms.js"></script>
<script>
let currentPanel = null;
function togglePanel(panelId) {
  const sideDetail = document.getElementById("sideDetail");
  const panels = document.querySelectorAll(".panel");

  if (currentPanel === panelId) {
    // 이미 열린 걸 다시 누르면 닫기
    sideDetail.classList.remove("open");
    panels.forEach(panel => panel.classList.remove("active"));
    currentPanel = null;
  } else {
    // 다른 패널 열기
    sideDetail.classList.add("open");
    panels.forEach(panel => panel.classList.remove("active"));
    document.getElementById(panelId + "Panel").classList.add("active");
    currentPanel = panelId;
  }
}
</script>
</body>
</html>
