var container = $('#map')[0];
var options = {
    center: new kakao.maps.LatLng(37.50497887258854, 127.06395865447985),
    level: 7
};
var kakaoMap = new kakao.maps.Map(container, options);

var polygon = null;

$(function() {
    $(document).on('click', '.search-li',async function(e) {
        e.preventDefault();
        try {
            const text = $('#searchTxt').val();
            const url = `http://localhost:8000/api/region?name=${encodeURIComponent(text)}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('서버 오류:', res.status, errorText);
                alert(`서버 오류: ${res.status}`);
                return;
            }

            const data =  await res.json();
            console.log("응답 데이터:", data);
            // panTo(data.centerCoords[0], data.centersCoords[1]);
            // makePolygon(data.coords, data.zone);

        } catch (err) {
            console.error("요청 실패:", err);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            $('#searchBtn').prop('disabled', false); // 검색 버튼 비활성화
        }

         
    });

});

// 지도에 폴리곤 표시하는 함수
function makePolygon(polygonArr, zoneStatus) {
    const polygonPath = polygonArr
        .map(coordPair => 
            new kakao.maps.LatLng(coordPair[0], coordPair[1])
        );

    if(zoneStatus == 'danger') {
        if(polygon) {
            polygon.setMap(null);
        }

        polygon = new kakao.maps.Polygon({
            path:polygonPath, // 그려질 다각형의 좌표 배열입니다
            strokeWeight: 3,// 선의 두께입니다
            strokeColor: '#ed2415', // 빨간색
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid', // 선의 스타일입니다
            fillColor: '#ed2415',// 채우기 색깔입니다
            fillOpacity: 0.3 // 채우기 불투명도 입니다
        });
            // 지도에 다각형을 표시합니다
            polygon.setMap(kakaoMap); 
    
    } else if(zoneStatus == 'safe') {
        if(polygon) {
            polygon.setMap(null);
        }
        // 지도에 표시할 다각형을 생성합니다
        polygon = new kakao.maps.Polygon({
            path:polygonPath, // 그려질 다각형의 좌표 배열입니다
            strokeWeight: 3,// 선의 두께입니다
            strokeColor: '#48b445', // 초록색
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid', // 선의 스타일입니다
            fillColor: '#48b445',// 채우기 색깔입니다
            fillOpacity: 0.3 // 채우기 불투명도 입니다

        });

        // 지도에 다각형을 표시합니다
        polygon.setMap(kakaoMap); 

    } else {
        console.log("에러");
    }

}

// 사용자가 입력한 구의 중심좌표로 이동하는 함수
function panTo(lat, lng) {
    map.panTo(new kakao.maps.LatLng(lat, lng));

}
