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
	<script src="/static/js/label/KOR_LABEL_LV5.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
	

    
</head>

<body>

<header>
    <div class="logo">JAEWON 교통지도</div>
    <nav class="nav">
        <a href="#">교통지도</a>
        <a href="#">노선검색</a>
        <a href="#">사고정보</a>
        <a href="#">CCTV</a>
    </nav>
</header>

<div class="container">
    <aside class="sidebar">
        <h3>실시간 정보</h3>

        <div class="traffic-status">
            <div class="status green">원활 (80km/h 이상)</div>
            <div class="status orange">서행 (40~80km/h)</div>
            <div class="status red">정체 (40km/h 미만)</div>
        </div>

        <h4>노선 검색</h4>
        <input type="text" placeholder="노선명 또는 번호 입력">

        <h4>공지사항</h4>
        <ul>
            <li>교통방송 시스템 점검 안내</li>
            <li>야간 작업 구간 주의</li>
        </ul>
    </aside>

    <main class="map-area">
    	<button id="toggle-accident" class="btn-accident">사고 보기</button>
    	<button id="toggle-cctv" class="cctv-toggle-btn">CCTV 보기</button>
        <div id="map" style="height: 100vh;"></div>
    </main>
</div>

<script src="/static/js/gis/gisMainController.js"></script>
<script src="/static/js/cctv/gisCctv.js"></script>
<script src="/static/js/accident/accident.js"></script>

</body>
</html>
