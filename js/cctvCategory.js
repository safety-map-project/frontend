const cctvMenu = document.getElementById('cctv');
const searchTxt = document.getElementById('searchTxt');
const searchBtn = document.getElementById('searchBtn');
const imageSrc = "../css/assets/cctv_marker.png";
let district = "";
let selectedRegionID = 0;
let isVisible = false;
// var cctvs = [];
let cctvMarkers = [];
let positions = [];
let regions = [];

cctvMenu.addEventListener('click', async () => {
    if (isVisible = false) {
        cctvMenu.className = 'menu_selected';
        isVisible = true;

        await getRegion();
        await getCCTVS(selectedRegionID);
        createCCTVMarkers();
        setCCTVMarkers(map);
        // changeMarker('cctv');
    } else if (isVisible = true) {
        cctvMenu.className = '';
        isVisible = false;
        setCCTVMarkers(null);
    };
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
        let imageOptions = {
            offset: new kakao.maps.Point(16, 16)
        };

        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOptions);

        let marker = createMarker(positions[i], markerImage);

        cctvMarkers.push(marker);
    };
};

function setCCTVMarkers(map) {
    for (let i = 0; i < cctvMarkers.length; i++) {
        cctvMarkers[i].setMap(map);
    }
};

// function changeMarker(type) {
//     // const police = document.getElementById('police');

//     if (type === 'cctv') {
//         cctvMenu.className = 'menu_selected';
//         // police.className = '';

//         setCCTVMarkers(map);
//     }else if (type === 'police') {
//         cctvMenu.className = '';
//         police.className = 'menu_selected';
//     }
// };

//function getDistrictFromUser() {
searchBtn.addEventListener('click', () => {
    district = searchTxt.value.trim();  
});
//};

 async function getRegion() {
    try {
        const response = await fetch("http://localhost:8000/api/region/sigu", {
            method : "GET"
        });
        
        if (response.ok) {
            const regions = await response.json();
            
            regions.forEach(region => {
                let address = region.si + " ";
                // console.log(address);
                // selectedRegionID = region.regionId;
                // console.log(selectedRegionID);
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