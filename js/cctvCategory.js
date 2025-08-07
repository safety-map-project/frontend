// const cctvMenu = document.getElementById('cctv');
// const searchTxt = document.getElementById('searchTxt');
// const searchBtn = document.getElementById('searchBtn');
const imageSrc = "../css/assets/cctv_marker.png";
let district = "";
// var cctvs = [];
let cctvMarkers = [];
let positions = [];
let regions = [];
let selectedRegionID = 0;

// cctvMenu.addEventListener('click', async () => {
//     //getDistrictFromUser();
//     // getMarkerPositions();

//     await getRegion();
//     await getCCTVS();
//     createCCTVMarkers();
//     changeMarker('cctv');
// });

async function getCCTVS(selectedRegionID) {
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
            // var cctv = JSON.parse(cctvs);
            // console.log(cctvs[0].key === "CCTVID");
            cctvs.forEach(cctv => {
                // console.log(cctv.REGIONID);
                console.log(selectedRegionID);
                if (cctv.REGIONID === selectedRegionID) {
                    // console.log(cctv.REGIONID);
                    // var latlng = new kakao.maps.LatLng(cctv.LAT, cctv.LOG);
                    
                    
                    positions.push(new kakao.maps.LatLng(cctv.LAT, cctv.LOG));
                    
                };
                
            });
        };
        // console.log(positions);
    }catch (error){
        console.error("CCTV 데이터 로드 실패", error);
    }
};
district = "종로구";
getRegion();
getCCTVS();
// console.log(positions);

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
// getCCTVS();
// getRegion();
// getMarkerPositions();
// console.log(positions);
// getMarkerPositions();
// function createMarkers() {
//     for (var i = 0; i < positions.length; i++) {
//         var imageSize = new kakao.maps.Size(24, 35);
//         var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        
//         var marker = new kakao.maps.Marker({
//             map: map,
//             position: positions[i].latlng,
//             image : markerImage
//         });
//     }
// };

function createMarkerImage(src, size) {
    return new kakao.maps.MarkerImage(src, size);
};

function createMarker(position, image) {
    return new kakao.maps.Marker({
        position: position,
        image: image
    });
};

function createCCTVMarkers() {
    cctvMarkers = [];

    for (let i = 0; i < positions.length; i++) {
        let imageSize = new kakao.maps.Size(16, 16);
        // let imageOptions = {
        //     offset: new kakao.maps.Point(32, 64)
        // };

        // 마커 이미지 생성
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커 생성
        let marker = createMarker(positions[i], markerImage);

        cctvMarkers.push(marker);
    };
};

function setCCTVMarkers(map) {
    for (let i = 0; i < cctvMarkers.length; i++) {
        cctvMarkers[i].setMap(map);
    }
};

function changeMarker(type) {
    const police = document.getElementById('police');

    if (type === 'cctv') {
        cctvMenu.className = 'menu_selected';
        police.className = '';
    }else if (type === 'police') {
        cctvMenu.className = '';
        police.className = 'menu_selected';

        setCCTVMarkers(map);
    }
};

//function getDistrictFromUser() {
// searchBtn.addEventListener('click', () => {
//     // alert(searchTxt.value);
//     district = searchTxt.value.trim();  
//     // alert(district);
// });
// alert(searchTxt.value);
// console.log(district);
//};

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
            
            regions.forEach(region => {
                let address = region.si + " ";
                // console.log(address);
                selectedRegionID = region.regionId;
                // console.log(selectedRegionID);
                if (region.gu === district) {
                    // console.log(selectedRegionID);
                    return selectedRegionID = region.regionId;
                }else if (address.concat(region.gu) === district) {
                    
                    return selectedRegionID = region.regionId;
                }else if (address.substring(0, 2) + "시 " + region.gu === district) {

                    return selectedRegionID;
                }else if (address.substring(0, 2) + " " + region.gu === district) {
        
                    return selectedRegionID;
                };
            });
            // console.log(regions);
        };
    } catch(error){
        console.error("CCTV 데이터 로드 실패", error);
    }
};
// getRegion();
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