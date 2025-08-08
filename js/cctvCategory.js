const cctvMenu = document.getElementById('cctv');
const policeMenu = document.getElementById('police');
const searchTxt = document.getElementById('searchTxt');
const searchBtn = document.getElementById('searchBtn');
const imageSrc = "../css/assets/cctv_marker.png";
const markerimageSrc = "../css/assets/policeLogo.png";
let district = "";
let selectedRegionID = 0;
let isCCTVDataDisplay = false;
let isPoliceDataDisplay = false;
// var cctvs = [];
let cctvMarkers = [];
let positions = [];
let regions = [];
let policeList = [];
let policeLocationsList = []; // 주소
let positionList = []; // 위도+경도 
let nameList = []; // 파출소 이름
let policeMarkers = []; // 마커 객체 배열

searchBtn.addEventListener('click', () => {
    district = searchTxt.value.trim();
});

cctvMenu.addEventListener('click', async () => {
    changeMarker(cctv);

    if (!isCCTVDataDisplay) {
        await getRegion();
        await getCCTVS(selectedRegionID);
        createCCTVMarkers();
        setCCTVMarkers(map);
    } else {        
        removeCCTVMarkers();
    };
});

// 버튼 클릭 시 실행 (토글 방식)
policeMenu.addEventListener("click", async () => {
    changeMarker(police);

    if (!isPoliceDataDisplay) {
        await getPoliceApi();         // 데이터 받아오기
        createPoliceMarkers();        // 마커 생성

        showPoliceMarkers(map);           // 마커 표시
    } else {
        hidePoliceMarkers();              // 마커 숨김
    }
});

async function getCCTVS(selectedRegionID) {
    try {
        const response = await fetch("http://localhost:8000/api/cctv", {
            method : "GET"
        });
        
        if (response.ok) {
            const cctvs = await response.json();

            cctvs.forEach(cctv => {
                if (cctv.regionId === selectedRegionID) {                    
                    positions.push(new kakao.maps.LatLng(cctv.lat, cctv.log));                
                };
            });
        };
    }catch (error){
        console.error("CCTV 데이터 로드 실패", error);
    }
};

async function getRegion() {
    try {
        const response = await fetch("http://localhost:8000/api/region/sigu", {
            method : "GET"
        });
        
        if (response.ok) {
            const regions = await response.json();
            
            regions.forEach(region => {
                let address = region.si + " ";

                if (region.gu === district) {
                    selectedRegionID = region.regionId;
                }else if (address.concat(region.gu) === district) {
                    selectedRegionID = region.regionId;
                }else if (address.substring(0, 2) + "시 " + region.gu === district) {
                    selectedRegionID = region.regionId;
                }else if (address.substring(0, 2) + " " + region.gu === district) {
                    selectedRegionID = region.regionId;
                };
            });
        };
    } catch(error){
        console.error("CCTV 데이터 로드 실패", error);
    }
};


// function findRegionID() {

//     regions.forEach(region => {
//         const address = "";
//         const gu = (region.key === "gu") ? value : "";
//         const regionID = (region.key === "regionId") ? value : "";
//         if (gu === district) {
//             // console.log(regionID);
//             return regionID;
//         }else if (region.key === "si") {
//             address.concat(value);
//             address += " ";
//             address.concat(gu);

//             return address === district ? regionID : "";
//         }else {
//             address.substring(0, 2) + " " + address.concat(gu);
//             // console.log(address + "\n");

//             return address === district ? regionID : "";
//         }; 
//     });    
// };


// 데이터 받아오기
async function getPoliceApi() {
    try {
        const res = await fetch("http://localhost:8000/api/police", {
            method: "GET"
        });

        const data = await res.json();

        // 배열 초기화
        policeList = [];
        policeLocationsList = [];
        positionList = [];
        nameList = [];
        data.forEach(element => {
            const police = {
                location: element.location,
                lat: element.lat,
                log: element.log,
                regionId: element.regionId,
                name: element.name
            };

            policeList.push(police);
            policeLocationsList.push(police.location);
            positionList.push(new kakao.maps.LatLng(police.lat, police.log));
            nameList.push(police.name);


        });


    } catch (error) {
        console.error("Police 데이터 로드 실패", error);
    }
}


// function getMarkerPositions() {
//     positions = [];

//     JSON.parse(cctvs).forEach(cctv => {
//         var regionID = (cctv.key === "REGIONID" ? value : "");
//         if (regionID !== selectedRegionID) {
//             return;
//         };
//         // console.log(regionID);
//         const position = {};
//         var lat = cctv.key === "LAT" ? value : "";
//         var lng = cctv.key === "LOG" ? value : "";
//         position['latlng'] = new kakao.maps.LatLng(lat, lng);
//         positions.push(position);
//     });
// };


function createMarkerImage(src, size, options) {
    return new kakao.maps.MarkerImage(src, size, options);
};

function createCCTVMarker(position, image) {
    return new kakao.maps.Marker({
        position: position,
        image: image
    });
};

function createCCTVMarkers() {
    cctvMarkers = [];

    for (let i = 0; i < positions.length; i++) {
        let imageSize = new kakao.maps.Size(16, 16);
        let imageOptions = {
            offset: new kakao.maps.Point(16, 16)
        };

        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOptions);

        let marker = createCCTVMarker(positions[i], markerImage);

        cctvMarkers.push(marker);
    };
};

// 마커 생성 함수
function createPoliceMarker(position, image, title) {
    return new kakao.maps.Marker({
        position: position,
        image: image,
        title: title
    });
}

// 경찰 마커 생성 함수
function createPoliceMarkers() {
    policeMarkers = []; // 초기화

    for (var i = 0; i < positionList.length; i++) {
        var imageSize = new kakao.maps.Size(64, 64);
        var imageOptions = {
            offset: new kakao.maps.Point(32, 64)
        };

        // 마커 이미지 생성
        var markerImage = new kakao.maps.MarkerImage(markerimageSrc, imageSize, imageOptions);

        // 마커 생성
        var marker = createPoliceMarker(positionList[i], markerImage, nameList[i]);

        policeMarkers.push(marker);
    }
}

function setCCTVMarkers(map) {
    for (let i = 0; i < cctvMarkers.length; i++) {
        cctvMarkers[i].setMap(map);
    }

    isCCTVDataDisplay = true;
};

function removeCCTVMarkers() {
    for (let i = 0; i < cctvMarkers.length; i++) {
        cctvMarkers[i].setMap(null);
    }
    cctvMenu.className = 'menu_no_selected';
    isCCTVDataDisplay = false;
}

// 마커 지도 표시 함수
function showPoliceMarkers(map) {
    for (let i = 0; i < policeMarkers.length; i++) {
        policeMarkers[i].setMap(map);
    }
    isPoliceDataDisplay = true;
}

// 마커 지도 숨김 함수
function hidePoliceMarkers() {
    for (let i = 0; i < policeMarkers.length; i++) {
        policeMarkers[i].setMap(null);
    }
    policeMenu.className = 'menu_no_selected';
    isPoliceDataDisplay = false;
}

function changeMarker(type) {
    if (type === 'cctv') {
        cctvMenu.className = 'menu_selected';
        policeMenu.className = '';
    }else if (type === 'police') {
        policeMenu.className = 'menu_selected';
        cctvMenu.className = '';
    };
};














