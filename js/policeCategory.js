// 경찰 카테고리 버튼 클릭 시 지도에 표시되는 마커 JS

// 이미지 주소 
const markerimageSrc = "../css/assets/policeLogo.png";

// 데이터 저장 배열
let policeList = [];
let policeLocationsList = []; // 주소
let positionList = []; // 위도+경도 
let nameList = []; // 파출소 이름
let policeMarkers = []; // 마커 객체 배열

// 데이터 받아오기
async function getPoliceApi() {
    try {
        const res = await fetch("http://localhost:8000/api/police", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
            
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

// 마커 이미지 생성 함수
function createMarkerImage(src, size, options) {
    return new kakao.maps.MarkerImage(src, size, options);
}

// 마커 생성 함수
function createMarker(position, image, title) {
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
        var marker = createMarker(positionList[i], markerImage, nameList[i]);

        policeMarkers.push(marker);
    }
}

// 마커 지도 표시 함수
function setPoliceMarkers(map) {
    for (let i = 0; i < policeMarkers.length; i++) {
        policeMarkers[i].setMap(map);
    }
}

// 카테고리 변경 함수
function changeMarker(type) {
    const cctv = document.getElementById('cctv');
    const police = document.getElementById('police');

    if (type === 'police') {
        cctv.className = '';
        police.className = 'menu_selected';

        // setCoffeeMarkers(null);
        // setStoreMarkers(null);
        setPoliceMarkers(map); // 경찰 마커 표시
    }
}

// 버튼 클릭 시 실행
document.getElementById("police").addEventListener("click", async () => {
    await getPoliceApi();         // 데이터 받아오기
    createPoliceMarkers();        // 마커 생성
    changeMarker('police');       // 마커 표시
});


// 이미지하고 이미지크기 수정 
// 카테고리 클릭 안된상태로 시작 

