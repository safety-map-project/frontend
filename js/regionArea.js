var container = $('#map')[0];
var options = {
    center: new kakao.maps.LatLng(37.50497887258854, 127.06395865447985),
    level: 7
};
var kakaoMap = new kakao.maps.Map(container, options);

let currentPolygon = null;

$(function() {

    // 리스트 요소를 클릭 했을 경우
    $(document).on('click', '.search-li', async function(e) {

        try {
            const text = $('#searchTxt').val();
            const url = `http://localhost:8000/api/region?name=${encodeURIComponent(text)}`;
            $('#searchBtn').prop('disabled', true);
            const res = await fetch(url, {
                method: 'GET',
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('서버 오류:', res.status, errorText);
                return;
            }

            let data =  await res.json();
            // console.log("응답 데이터: ", data);
            
                // 검색한 지역이 존재할 경우에만(data 값이 true일 경우에만) 폴리곤을 표시
                // ex. 부산광역시 강남구 같은 걸 입력하면 폴리곤 안 띄워줌
            if(data.existRegionTF) {
                makePolygon(data.coords, data.zone);
                panTo(data.centerCoords[0], data.centerCoords[1]);
            }

        } catch (err) {
            console.error("요청 실패:", err);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            $('#searchBtn').prop('disabled', false);
        }

         
    });

    // 검색 버튼 클릭 시
    $(document).on('click', '#searchBtn', async function(e) {

        let inputText = $('#searchTxt').val(); // 사용자가 입력한 값

        // 시/구까지 입력했을 경우에만 데이터 요청을 보낸다.
        if(inputText.includes('시') && inputText.includes('구')) { 
            try {
                const text = $('#searchTxt').val();
                const url = `http://localhost:8000/api/region?name=${encodeURIComponent(text)}`;
                // 모든 과정을 동기 처리 하기 위해 
                // 데이터를 요청하는 과정에서 await을 붙였다.
                const res = await fetch(url, {
                    method: 'GET',
                });
                let data = await res.json();
                // console.log("응답 데이터: ", data);

                // 검색한 지역이 존재할 경우에만(data 값이 true일 경우에만) 폴리곤을 표시
                // ex. 부산광역시 강남구 같은 걸 입력하면 폴리곤 안 띄워줌
                if(data.existRegionTF) {
                    makePolygon(data.coords, data.zone);
                    panTo(data.centerCoords[0], data.centerCoords[1]);
                }
                $('#searchBtn').prop("disabled", true);

            } catch(err) {
                console.log("요청 실패: ", err);
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                $('#searchBtn').prop("disabled", false);
            }
        } else {
            return;
        }

    });

    // 지도에 폴리곤 표시하는 함수
    function makePolygon(polygonArr, zoneStatus) {

        // 지도에 이전 polygon이 남아있으면 제거한다.
        if(currentPolygon) {
            currentPolygon.setMap(null);
        }

        // 백엔드에서 polygon 좌표들을 담을 배열을 생성한다.
        const polygonPath = polygonArr.map(coordPair =>
            new kakao.maps.LatLng(coordPair[0], coordPair[1])
        );
    
        // fetch 요청으로 받아온 구역 정보(zoneStatus)에 따라 색상이 바뀐다.
        const color = zoneStatus === 'danger' ? '#ed2415' : '#48b445'; // 위험지역이면 빨간색으로 표시
                                                                                                        // 안전지역이면 초록색으로 표시
    
        // 폴리곤 객체를 생성
        const polygon = new kakao.maps.Polygon({
            path: polygonPath, // 좌표 배열
            strokeWeight: 3, // 선 두께
            strokeColor: color, // 선 색상
            strokeOpacity: 1, // 선 투명도
            strokeStyle: 'solid', // 선 종류
            fillColor: color, // 채우기 색상
            fillOpacity: 0.3 // 채우기 투명도
        });
    
        polygon.setMap(map); // 만들어진 polygon을 map에다가 세팅한다.

        currentPolygon = polygon; // currentPolygon에 갱신한다.
    }
        

    // 사용자가 입력한 구의 중심좌표로 이동하는 함수
    function panTo(lat, lng) {
        map.panTo(new kakao.maps.LatLng(lat, lng));
    }

});
