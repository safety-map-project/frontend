const cctvBtn = document.getElementById('cctv');
const searchTxt = document.getElementById('searchTxt');
const imageSrc = "../css/cctv_marker.png";
var cctvs = [];
var cctvMarkers = [];
var positions = [];
var regions = [];
async function getCCTVS() {
    try {
        const response = await fetch("http://localhost:8000/api/cctv", {
            method : "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            }
        });
        
        if (response.ok) {
            const cctvs = await response.json();
            // console.log(data[0]);
            
            return cctvs;
        };

    }catch (error){
        console.error("CCTV 데이터 로드 실패", error);
    }
};

cctvBtn.addEventListener('click', async () => {
    await getCCTVS();
    await getRegion();
    createCCTVMarkers();
    changeMarker(cctv);
});

function getMarkerPosition() {
    cctvs.forEach(cctv => {
        var regionID = (cctv.key === "REGIONID" ? value : "");
        if (regionID !== findRegionID()) {
            return;
        };
        
        const position = {};
        var lat = cctv.key === "LAT" ? value : "";
        var lng = cctv.key === "LOG" ? value : "";
        position['latlng'] = new kakao.maps.LatLng(lat, lng);
        positions.push(position);
    });

    return positions;
};

function createMarkers() {
    for (var i = 0; i < positions.length; i++) {
        var imageSize = new kakao.maps.Size(24, 35);
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        
        var marker = new kakao.maps.Marker({
            map: map,
            position: positions[i].latlng,
            image : markerImage
        });
    }
};

function createMarkerImage(src, size, options) {
    return new kakao.maps.MarkerImage(src, size, options);
};

function createMarker(position, image) {
    return new kakao.maps.Marker({
        position: position,
        image: image
    });
};

function createCCTVMarkers() {
    var positions = getMarkerPosition();

    for (var i = 0; i < positions.length; i++) {
        var imageSize = new kakao.maps.Size(64, 64);
        var imageOptions = {
            offset: new kakao.maps.Point(32, 64)
        };

        // 마커 이미지 생성
        var markerImage = new kakao.maps.MarkerImage(markerimageSrc, imageSize, imageOptions);

        // 마커 생성
        var marker = createMarker(positions[i], markerImage);

        cctvMarkers.push(marker);
    }
};

function setPoliceMarkers(map) {
    for (let i = 0; i < cctvMarkers.length; i++) {
        cctvMarkers[i].setMap(map);
    }
};

function changeMarker(type) {
    const cctv = document.getElementById('cctv');
    const police = document.getElementById('police');

    if (type === 'cctv') {
        cctv.className = 'menu_selected';
        police.className = '';
    }
    if (type === 'police') {
        cctv.className = '';
        police.className = 'menu_selected';

        setCCTVMarkers(map); // 경찰 마커 표시
    }
};

async function getResult() {
    return searchTxt.value;
};

async function getRegion() {
    try {
        const response = await fetch("http://localhost:8000/api/region/sigu", {
            method : "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            }
        });
        
        if (response.ok) {
            const regions = await response.json();

            return regions;
        };
    } catch(error){
        console.error("CCTV 데이터 로드 실패", error);
    }
};

function findRegionID() {
    regions.forEach(region => {
        const address = "";
        const gu = (region.key === "GU") ? value : "";
        const regionID = (region.key === "REGIONID") ? value : "";
        if (gu === getResult()) {
            return regionID;
        }else if (region.key === "SI") {
            address.concat(value);
            address += " ";
            address.concat(gu);

            return address === getResult() ? regionID : "";
        }else {
            address.substring(0, 2) + " " + address.concat(gu);

            return address === getResult() ? regionID : "";
        }; 
    });    
};